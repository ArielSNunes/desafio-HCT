<?php
class Cadastro
{
    public $nome;
    public $email;
    public $cidade;
    public $estado;
    public $comentarios;
    private $pdo;
    public function __construct($nome, $email, $cidade, $estado, $comentarios)
    {
        $this->nome = $nome;
        $this->email = $email;
        $this->cidade = $cidade;
        $this->estado = $estado;
        $this->comentarios = $comentarios;
        try {
            $this->pdo = new PDO(
                'mysql:host=127.0.0.1;port=3306;dbname=teste',
                'root',
                '',
                array(
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                )
            );
        } catch (PDOException $ex) {
            echo ('Ocorreu um erro: ' . $ex->getMessage());
        }
    }
    public function getConnection()
    {
        return $this->pdo;
    }
    public function selectAll()
    {
        $sql = 'SELECT * FROM cadastro';
        $sql = $this->pdo->prepare($sql);
        $sql->execute();
        if ($sql->rowCount() > 0) {
            return $sql->fetchAll();
        } else {
            return null;
        }
    }
    public function selectByEstado($estado)
    {
        $sql = 'SELECT * FROM cadastro WHERE estado = :estado';
        $sql = $this->pdo->prepare($sql);
        $sql->bindValue(':estado', $estado);
        $sql->execute();
        if ($sql->rowCount() > 0) {
            return $sql->fetchAll();
        } else {
            return null;
        }
    }
    public function deleteByEstadoAndComentario($estado, $comentario)
    {
        $sql = 'DELETE FROM cadastro WHERE estado = :estado AND comentarios = :comentario';
        $sql = $this->pdo->prepare($sql);
        $sql->bindValue(':estado', $estado);
        $sql->bindValue(':comentario', $comentario);
        $sql->execute();
        if ($sql->rowCount() > 0) {
            return $sql->fetchAll();
        } else {
            return null;
        }
    }
    public function selectAllGroupBy($campo)
    {
        $sql = 'SELECT * FROM cadastro GROUP BY ' . $campo;
        $sql = $this->pdo->prepare($sql);
        $sql->execute();
        if ($sql->rowCount() > 0) {
            return $sql->fetchAll();
        } else {
            return null;
        }
    }
}
