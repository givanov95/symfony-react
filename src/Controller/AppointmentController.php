<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Appointment;
use Ramsey\Uuid\Uuid;

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
                'uuid' => $appointment->getUuid(),
                'name' => $appointment->getNames(),
                'egn' => $appointment->getPersonalIdentityNumber(),
                'time' => $appointment->getTime(),
                'description' => $appointment->getDescription(),
            ];
        }

        return $this->json($data);
    }

    #[Route('/appointments/create"', name: 'appointment_create', methods: 'GET')]
    public function crate()
    {
    }

    #[Route('/appointments', name: 'add_appointment', methods: 'POST')]
    public function store(ManagerRegistry $doctrine, Request $request): Response
    {
        $entityManager = $doctrine->getManager();
        $appointment = new Appointment();
        $appointment->setUuid(Uuid::uuid4()->toString());
        $appointment->setNames($request->request->get('name'));
        $appointment->setPersonalIdentityNumber($request->request->get('personalNumber'));
        $time = \DateTime::createFromFormat('Y-m-d', $request->request->get('time'));
        $appointment->setTime($time);
        $appointment->setDescription($request->request->get('description'));

        $entityManager->persist($appointment);
        $entityManager->flush();

        $formattedTime = $appointment->getTime()->format('Y-m-d'); // Convert DateTime to string
        return $this->json('New appointment has been added successfully for ' . $formattedTime);
    }

    #[Route('/appointments/edit/{uuid}', name: 'appointment_edit', methods: ['GET'])]
    public function edit(ManagerRegistry $doctrine, string $uuid): Response
    {
        $entityManager = $doctrine->getManager();
        $appointment = $entityManager->getRepository(Appointment::class)->findOneBy(['uuid' => $uuid]);

        if (!$appointment) {
            return $this->json('No Appointment found', 404);
        }

        $data = [
            'uuid' => $appointment->getUuid(),
            'name' => $appointment->getNames(),
            'egn' => $appointment->getPersonalIdentityNumber(),
            'time' => $appointment->getTime(),
            'description' => $appointment->getDescription(),
        ];

        return $this->json($data);
    }

    #[Route('/appointments/edit"', name: 'appointment_update', methods: 'PUT')]
    public function update(ManagerRegistry $doctrine, Request $request, int $id): Response
    {
        $entityManager = $doctrine->getManager();
        $employee = $entityManager->getRepository(Employee::class)->find($id);
        if (!$employee) {
            return $this->json('No Employee found for id' . $id, 404);
        }
        $content = json_decode($request->getContent());
        $employee->setFullname($content->fullname);
        $employee->setEmail($content->email);
        $employee->setPassword($content->password);
        $employee->setDegree($content->degree);
        $employee->setDesignation($content->designation);
        $employee->setAddress($content->address);
        $employee->setContact($content->contact);
        $entityManager->flush();
        $data = [
            'id'        => $employee->getId(),
            'name'       => $employee->getFullname(),
            'password'   => $employee->getPassword(),
            'email'      => $employee->getEmail(),
            'degree'     => $employee->getDegree(),
            'designation' => $employee->getDesignation(),
            'address'    => $employee->getAddress(),
            'contact'    => $employee->getContact(),
            'password'  => $employee->getPassword(),
        ];
        return $this->json($data);
    }

    #[Route('/appointments/{uuid}', name: 'appointment_delete', methods: 'DELETE')]
    public function delete(ManagerRegistry $doctrine, string $uuid): Response
    {
        $entityManager = $doctrine->getManager();
        $appointment = $entityManager->getRepository(Appointment::class)->findOneBy(['uuid' => $uuid]);

        if (!$appointment) {
            return $this->json('No Appointment found', 404);
        }

        $entityManager->remove($appointment);
        $entityManager->flush();

        return $this->json('Deleted a Appointment successfully');
    }
}
