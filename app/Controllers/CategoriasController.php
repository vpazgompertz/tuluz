<?php

namespace App\Controllers;

use Twig\Environment;

class CategoriasController extends BaseController
{
    protected Environment $twig;

    public function __construct()
    {
        $config = new \Config\TwigConfig();
        $this->twig = $config->init();
    }

public function index($categoria)
    {
        $vista = "productos/$categoria/$categoria.html.twig";

        if (!file_exists(APPPATH . "Views/$vista")) {
            throw new \CodeIgniter\Exceptions\PageNotFoundException();
        }

        return $this->twig->render($vista);
    }

    public function subcategoria($categoria, $sub)
    {
        $vista = "productos/$categoria/$sub.html.twig";

        if (!file_exists(APPPATH . "Views/$vista")) {
            throw new \CodeIgniter\Exceptions\PageNotFoundException();
        }

        return $this->twig->render($vista);
    }
}