<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Appointment;

class AppointmentController extends AbstractController
{
    #[Route('/appointments', name: 'app_appointment', methods: 'GET')]
    public function index(ManagerRegistry $doctrine): Response
    {
        $appointments = $doctrine
            ->getRepository(Appointment::class)
            ->findAll();
        $data = [];

        foreach ($appointments as $appointment) {
            $data[] = [
                'id' => $appointment->getId(),
                'name' => $appointment->getNames(),
                'egn' => $appointment->getPersonalIdentityNumber(),
                'time' => $appointment->getTime(),
                'description' => $appointment->getDescription(),
            ];
        }
        return $this->json($data);
    }
}
