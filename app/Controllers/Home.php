<?php

namespace App\Controllers;

use Twig\Environment;

class Home extends BaseController
{
    protected Environment $twig;

    public function __construct()
    {
        $config = new \Config\TwigConfig();
        $this->twig = $config->init();
    }

    public function index(): string
    {
        return $this->twig->render('home.html.twig');
    }
}