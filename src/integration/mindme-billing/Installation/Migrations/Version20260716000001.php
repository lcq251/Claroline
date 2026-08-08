<?php

namespace Claroline\MindMeBillingBundle\Installation\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260716000001 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('
            CREATE TABLE IF NOT EXISTS claro_mindme_billing_order (
                id INT AUTO_INCREMENT NOT NULL,
                user_id INT NOT NULL,
                uuid VARCHAR(36) NOT NULL,
                trainingType VARCHAR(50) NOT NULL,
                trainingId INT NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                currency VARCHAR(10) DEFAULT \'CNY\' NOT NULL,
                channel VARCHAR(20) NOT NULL,
                status VARCHAR(20) NOT NULL,
                outTradeNo VARCHAR(64) NOT NULL,
                transactionId VARCHAR(64) DEFAULT NULL,
                qrCodeUrl TEXT DEFAULT NULL,
                redirectUrl TEXT DEFAULT NULL,
                paidAt DATETIME DEFAULT NULL,
                expiredAt DATETIME NOT NULL,
                createdAt DATETIME NOT NULL,
                updatedAt DATETIME NOT NULL,
                UNIQUE INDEX UNIQ_ORDER_UUID (uuid),
                UNIQUE INDEX UNIQ_ORDER_OUT_TRADE_NO (outTradeNo),
                INDEX idx_order_user (user_id),
                INDEX idx_order_status (status),
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB
        ');

        $this->addSql('
            ALTER TABLE claro_mindme_billing_order
            ADD CONSTRAINT FK_ORDER_USER
            FOREIGN KEY (user_id) REFERENCES claro_user (id) ON DELETE CASCADE
        ');

        $this->addSql('
            CREATE TABLE IF NOT EXISTS claro_mindme_billing_transaction (
                id INT AUTO_INCREMENT NOT NULL,
                order_id INT NOT NULL,
                uuid VARCHAR(36) NOT NULL,
                type VARCHAR(20) NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                channelTransactionId VARCHAR(64) DEFAULT NULL,
                rawCallback JSON DEFAULT NULL,
                createdAt DATETIME NOT NULL,
                UNIQUE INDEX UNIQ_TX_UUID (uuid),
                INDEX IDX_TX_ORDER (order_id),
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB
        ');

        $this->addSql('
            ALTER TABLE claro_mindme_billing_transaction
            ADD CONSTRAINT FK_TX_ORDER
            FOREIGN KEY (order_id) REFERENCES claro_mindme_billing_order (id) ON DELETE CASCADE
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE claro_mindme_billing_transaction');
        $this->addSql('DROP TABLE claro_mindme_billing_order');
    }

    public function isTransactional(): bool
    {
        return false;
    }
}
