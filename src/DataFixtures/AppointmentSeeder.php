<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Appointment;
use Doctrine\ORM\EntityManagerInterface;
use Ramsey\Uuid\Uuid;
use Faker\Factory;

class AppointmentSeeder extends Fixture
{

    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function load(ObjectManager $manager)
    {
        $faker = Factory::create();
        $entities = [];

        for ($i = 0; $i < 100; $i++) {
            $appointment = new Appointment();
            $appointment->setUuid(Uuid::uuid4()->toString());
            $appointment->setNames($faker->name);
            $appointment->setPersonalIdentityNumber($faker->numerify('##########'));
            $appointment->setTime($faker->dateTimeBetween('now', '+1 year'));
            $appointment->setDescription($faker->realText(50));

            $entities[] = $appointment;
        }

        $this->entityManager->beginTransaction();

        try {
            foreach ($entities as $entity) {
                $this->entityManager->persist($entity);
            }

            $this->entityManager->flush();
            $this->entityManager->commit();
        } catch (\Exception $e) {
            $this->entityManager->rollback();
            throw $e;
        }
    }
}
