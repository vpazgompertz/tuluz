<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;
use Twig\Environment;
use Twig\Loader\FilesystemLoader;

class TwigConfig extends BaseConfig
{
    public function init(): Environment
    {
        $loader = new FilesystemLoader(APPPATH . 'Views');
        $twig = new Environment($loader, [
            'cache' => WRITEPATH . 'cache/twig',
            'debug' => true,
        ]);

        return $twig;
    }
}