<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Appointment;
use Ramsey\Uuid\Uuid;

class AppointmentSeeder extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $names = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Davis', 'David Brown', 'Sarah Wilson', 'Daniel Taylor', 'Olivia Anderson', 'Matthew Thomas', 'Sophia Martinez', 'Sophia Martinez', 'Sophia Martinez', 'Sophia Martinez', 'Sophia Martinez', 'Sophia Martinez', 'Sophia Martinez', 'Sophia Martinez', 'Sophia Martinez', 'Sophia Martinez', 'Sophia Martinez', 'Sophia Martinez'];

        for ($i = 0; $i < 20; $i++) {
            $appointment = new Appointment();
            $appointment->setUuid(Uuid::uuid4()->toString());
            $appointment->setNames($names[$i]);
            $appointment->setPersonalIdentityNumber($this->generatePersonalIdentityNumber());
            $appointment->setTime($this->generateRandomTime());
            $appointment->setDescription($this->generateRandomDescription());

            $manager->persist($appointment);
        }

        $manager->flush();
    }

    private function generateRandomTime()
    {
        $times = ['10:00', '11:30', '14:15', '16:45', '19:00'];
        $index = array_rand($times);
        $timeString = $times[$index];

        $dateTime = \DateTime::createFromFormat('H:i', $timeString);
        if (!$dateTime) {
            throw new \Exception('Failed to create DateTime object from the generated time string.');
        }

        return $dateTime;
    }

    private function generateRandomDescription()
    {
        $descriptions = [
            'General check-up',
            'Dental cleaning',
            'X-ray examination',
            'Flu vaccination',
            'Follow-up consultation'
        ];
        $index = array_rand($descriptions);

        return $descriptions[$index];
    }

    private function generatePersonalIdentityNumber()
    {
        $characters = '0123456789';
        $pin = '';

        for ($i = 0; $i < 10; $i++) {
            $pin .= $characters[rand(0, strlen($characters) - 1)];
        }

        return $pin;
    }
}
