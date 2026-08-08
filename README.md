README
======

## Install
git clone https://github.com/claroline/Claroline MY_PROJECT_DIR
composer install --no-dev --optimize-autoloader
npm install --legacy-peer-deps --unsafe-perm
rm -rf var/cache/prod
npm run webpack
php bin/console claroline:install -vvv



[![Last release](https://img.shields.io/github/v/release/claroline/Claroline)](https://github.com/claroline/Claroline/releases)
[![Join the chat at https://gitter.im/claroline/Claroline](https://badges.gitter.im/claroline/Claroline.svg)](https://gitter.im/claroline/Claroline?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://github.com/claroline/Claroline/workflows/CI/badge.svg)](https://github.com/claroline/Claroline/actions)

[Claroline Connect](https://www.claroline.com) is an Open Source Learning Management System developed 
in a [Symfony](https://symfony.com/) and [React](https://reactjs.org) environment.

Getting Started
---------------

- See the [Claroline requirements](https://claroline.github.io/Claroline/sections/getting-started/requirements.html)
- Check the [Browser support](https://claroline.github.io/Claroline/sections/getting-started/browser-support.html)
- [Install Claroline](https://claroline.github.io/Claroline/sections/getting-started/installation.html)

Documentation
-------------

- For the technical guide, see [here](https://claroline.github.io/Claroline).
- For user documentation, see [here](https://support.claroline.com/#/desktop/workspaces/open/documentation/home/accueil).

Contributing
-------------

Read our [Contributing guidelines](https://claroline.github.io/Claroline/sections/dev/contributing.html).

Security
--------

If you discover a security vulnerability within Claroline Connect, please follow our [disclosure procedure](https://github.com/claroline/Claroline/blob/13.1/SECURITY.md).
