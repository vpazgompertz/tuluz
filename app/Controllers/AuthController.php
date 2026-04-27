<?php

namespace App\Controllers;

use Twig\Environment;

class AuthController extends BaseController
{
    protected Environment $twig;

    public function __construct()
    {
        $config = new \Config\TwigConfig();
        $this->twig = $config->init();
    }

    public function login()
    {
        return $this->twig->render('login.html.twig');
    }
}