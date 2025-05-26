<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\DevBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpKernel\KernelInterface;

class TranslationImportCommand extends Command
{
    public function __construct(
        private readonly KernelInterface $kernel
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->setDescription('Imports a zip archive which contains all the translation files of the platform in a simplified directory structure.')
            ->setDefinition([
                new InputArgument('archivePath', InputArgument::REQUIRED, 'The path to the archive to import'),
                new InputOption('lang', 'l', InputOption::VALUE_REQUIRED, 'The language to import'),
            ])
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $lang = $input->getOption('lang');
        $archivePath = $input->getArgument('archivePath');
        if (!file_exists($archivePath)) {
            throw new \RuntimeException(sprintf('Archive path "%s" does not exist.', $archivePath));
        }

        $archive = new \ZipArchive();
        $archive->open($archivePath, \ZipArchive::ER_READ);
        $archiveName = basename($archive->filename, '.zip');

        $filesystem = new Filesystem();
        for ($i = 0; $i < $archive->numFiles; ++$i) {
            $fileName = $archive->getNameIndex($i);

            if (str_ends_with($fileName, '.'.$lang.'.json')) {
                $filePath = str_replace($archiveName.'/', '', pathinfo($fileName, PATHINFO_DIRNAME));
                $destinationDir = implode(DIRECTORY_SEPARATOR, [
                    $this->kernel->getProjectDir(),
                    $filePath,
                    'Resources',
                    'translations',
                ]);

                if ($filesystem->exists($destinationDir)) {
                    $filesystem->dumpFile($destinationDir.DIRECTORY_SEPARATOR.pathinfo($fileName, PATHINFO_BASENAME), $archive->getFromIndex($i));
                }
            }
        }

        return 0;
    }
}
