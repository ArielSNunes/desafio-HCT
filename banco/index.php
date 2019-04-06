<?php
require('Cadastro.php');

$nome = 'Ariel';
$email = 'arielsn@outlook.com';
$cidade = 'SJC';
$estado = 'SP';
$comentarios = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, at?';

$cadastro = new Cadastro($nome, $email, $cidade, $estado, $comentarios);

var_dump($cadastro->selectAll());
var_dump($cadastro->selectByEstado('RJ'));

$cadastro->deleteByEstadoAndComentario('SP','Estudante');
var_dump($cadastro->selectAll());

var_dump($cadastro->selectAllGroupBy('email'));
