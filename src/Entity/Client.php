<?php

namespace App\Entity;

use App\Repository\ClientRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ClientRepository::class)]
class Client
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private ?string $names = null;

    #[ORM\Column(length: 10)]
    private ?string $personal_identity_number = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNames(): ?string
    {
        return $this->names;
    }

    public function setNames(string $names): self
    {
        $this->names = $names;

        return $this;
    }

    public function getPersonalIdentityNumber(): ?string
    {
        return $this->personal_identity_number;
    }

    public function setPersonalIdentityNumber(string $personal_identity_number): self
    {
        $this->personal_identity_number = $personal_identity_number;

        return $this;
    }
}
