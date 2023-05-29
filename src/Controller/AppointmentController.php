<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Appointment;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Constraints as Assert;

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
                'personalNumber' => $appointment->getPersonalIdentityNumber(),
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
        $violations = $this->validateData($request->request->all());

        if (count($violations) > 0) {
            $errorMessages = [];

            foreach ($violations as $violation) {
                $errorMessages[] = $violation->getMessage();
            }

            return $this->json($errorMessages, 400);
        }

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

        return $this->json('New appointment has been added successfully');
    }

    #[Route('/appointments/show/{uuid}', name: 'appointment_show', methods: 'GET')]
    public function show(ManagerRegistry $doctrine, string $uuid)
    {
        $entityManager = $doctrine->getManager();
        $appointment = $entityManager->getRepository(Appointment::class)->findOneBy(['uuid' => $uuid]);

        if (!$appointment) {
            throw $this->createNotFoundException('Часът не е намерен.');
        }

        $data = [
            'id' => $appointment->getId(),
            'uuid' => $appointment->getUuid(),
            'name' => $appointment->getNames(),
            'personalNumber' => $appointment->getPersonalIdentityNumber(),
            'time' => $appointment->getTime(),
            'description' => $appointment->getDescription(),
        ];

        $clientAppointments = $entityManager->getRepository(Appointment::class)->findBy(['personal_identity_number' => $appointment->getPersonalIdentityNumber()]);

        $otherAppointments = [];

        foreach ($clientAppointments as $clientAppointment) {
            if ($clientAppointment->getUuid() !== $appointment->getUuid()) {
                $otherAppointments[] = [
                    'uuid' => $clientAppointment->getUuid(),
                    'name' => $clientAppointment->getNames(),
                    'personalNumber' => $clientAppointment->getPersonalIdentityNumber(),
                    'time' => $clientAppointment->getTime(),
                    'description' => $clientAppointment->getDescription(),
                ];
            }
        }

        return $this->json([
            'appointment' => $data,
            'otherAppointments' => $otherAppointments,
        ]);
    }


    #[Route('/appointments/edit/{uuid}', name: 'appointment_edit', methods: 'GET')]
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

    #[Route('/appointments/{uuid}', name: 'appointment_update', methods: 'PUT')]
    public function update(ManagerRegistry $doctrine, Request $request, string $uuid): Response
    {
        $entityManager = $doctrine->getManager();
        $appointment = $entityManager->getRepository(Appointment::class)->findOneBy(['uuid' => $uuid]);

        if (!$appointment) {
            return $this->json('No appointment found', 404);
        }

        $violations = $this->validateData((array)json_decode($request->getContent()));

        if (count($violations) > 0) {
            $errorMessages = [];

            foreach ($violations as $violation) {
                $errorMessages[] = $violation->getMessage();
            }

            return $this->json($errorMessages, 400);
        }

        $content = json_decode($request->getContent());
        $appointment->setNames($content->name);
        $appointment->setPersonalIdentityNumber($content->personalNumber);
        $time = \DateTime::createFromFormat('Y-m-d', $content->time);
        $appointment->setTime($time);
        $appointment->setDescription($content->description);

        $entityManager->flush();

        return $this->json('Appointment has been updated successfully');
    }

    #[Route('/appointments/{uuid}', name: 'appointment_delete', methods: 'DELETE')]
    public function destroy(ManagerRegistry $doctrine, string $uuid): Response
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

    private function validateData($data)
    {
        $validator = Validation::createValidator();

        $constraints = new Assert\Collection([
            'name' => new Assert\NotBlank(['message' => 'Name is required.']),
            'personalNumber' => [
                new Assert\NotBlank(['message' => 'Personal Number is required.']),
                new Assert\Regex([
                    'pattern' => '/^\d{10}$/',
                    'message' => 'Personal Number should be a 10-digit numeric value.',
                ]),
            ],
            'time' => [
                new Assert\NotBlank(['message' => 'Time is required.']),
                new Assert\DateTime([
                    'format' => 'Y-m-d',
                    'message' => 'Time should be a valid date in the format Y-m-d.',
                ]),
            ],
            'description' => new Assert\NotBlank(['message' => 'Description is required.']),
        ]);

        return $validator->validate($data, $constraints);
    }
}
