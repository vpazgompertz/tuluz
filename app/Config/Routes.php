<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->get('(:segment)',             'CategoriasController::index/$1');
$routes->get('(:segment)/(:segment)', 'CategoriasController::subcategoria/$1/$2');