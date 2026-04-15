/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-plusplus */
import { hash } from 'bcrypt';
import type { QueryRunner } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { hashConfig } from '@config/hash';
import { IScheduleDTO } from '@modules/companies/dtos/IScheduleDTO';
import { CompanyStatus } from '@modules/companies/enums/CompanyStatus';
import { ServiceStatus } from '@modules/companies/enums/ServiceStatus';
import { Role } from '@modules/users/entities/Role';
import { RoleType } from '@modules/users/enums/RoleType';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Return a MySQL-compatible datetime string (YYYY-MM-DD HH:MM:SS) for today at HH:MM */
function todayAt(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:00`;
}

/** Return a MySQL-compatible datetime string (YYYY-MM-DD HH:MM:SS) N days from today at HH:MM */
function daysFromNowAt(days: number, hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(h, m, 0, 0);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:00`;
}

// ─── Full weekly schedule (Mon–Fri 09-18, breaks 12-13; Sat 09-14; Sun closed) ───
const fullWeekSchedule: IScheduleDTO = {
  '0': null, // Sunday
  '1': {
    workHours: { start: '09:00', end: '18:00' },
    breaks: [{ start: '12:00', end: '13:00' }],
  },
  '2': {
    workHours: { start: '09:00', end: '18:00' },
    breaks: [{ start: '12:00', end: '13:00' }],
  },
  '3': {
    workHours: { start: '09:00', end: '18:00' },
    breaks: [{ start: '12:00', end: '13:00' }],
  },
  '4': {
    workHours: { start: '09:00', end: '18:00' },
    breaks: [{ start: '12:00', end: '13:00' }],
  },
  '5': {
    workHours: { start: '09:00', end: '18:00' },
    breaks: [{ start: '12:00', end: '13:00' }],
  },
  '6': { workHours: { start: '09:00', end: '14:00' }, breaks: [] },
};

// Compact schedule: Mon–Fri 08-17, one break 12-13; weekends closed
const compactSchedule: IScheduleDTO = {
  '0': null,
  '1': {
    workHours: { start: '08:00', end: '17:00' },
    breaks: [{ start: '12:00', end: '13:00' }],
  },
  '2': {
    workHours: { start: '08:00', end: '17:00' },
    breaks: [{ start: '12:00', end: '13:00' }],
  },
  '3': {
    workHours: { start: '08:00', end: '17:00' },
    breaks: [{ start: '12:00', end: '13:00' }],
  },
  '4': {
    workHours: { start: '08:00', end: '17:00' },
    breaks: [{ start: '12:00', end: '13:00' }],
  },
  '5': {
    workHours: { start: '08:00', end: '17:00' },
    breaks: [{ start: '12:00', end: '13:00' }],
  },
  '6': null,
};

// Extended schedule: every day 07-21, two breaks
const extendedSchedule: IScheduleDTO = {
  '0': {
    workHours: { start: '08:00', end: '20:00' },
    breaks: [
      { start: '12:00', end: '13:00' },
      { start: '18:00', end: '18:30' },
    ],
  },
  '1': {
    workHours: { start: '07:00', end: '21:00' },
    breaks: [
      { start: '12:00', end: '13:00' },
      { start: '18:00', end: '18:30' },
    ],
  },
  '2': {
    workHours: { start: '07:00', end: '21:00' },
    breaks: [
      { start: '12:00', end: '13:00' },
      { start: '18:00', end: '18:30' },
    ],
  },
  '3': {
    workHours: { start: '07:00', end: '21:00' },
    breaks: [
      { start: '12:00', end: '13:00' },
      { start: '18:00', end: '18:30' },
    ],
  },
  '4': {
    workHours: { start: '07:00', end: '21:00' },
    breaks: [
      { start: '12:00', end: '13:00' },
      { start: '18:00', end: '18:30' },
    ],
  },
  '5': {
    workHours: { start: '07:00', end: '21:00' },
    breaks: [
      { start: '12:00', end: '13:00' },
      { start: '18:00', end: '18:30' },
    ],
  },
  '6': {
    workHours: { start: '08:00', end: '18:00' },
    breaks: [{ start: '12:00', end: '13:00' }],
  },
};

// ─── IDs ──────────────────────────────────────────────────────────────────────

// Roles
const clientRoleId = uuid();

// Users (clients)
const client1Id = uuid();
const client1ProfileId = uuid();

const client2Id = uuid();
const client2ProfileId = uuid();

const client3Id = uuid();
const client3ProfileId = uuid();

const client4Id = uuid();
const client4ProfileId = uuid();

const client5Id = uuid();
const client5ProfileId = uuid();

// Users (employees)
const emp1Id = uuid();
const emp1ProfileId = uuid();

const emp2Id = uuid();
const emp2ProfileId = uuid();

const emp3Id = uuid();
const emp3ProfileId = uuid();

const emp4Id = uuid();
const emp4ProfileId = uuid();

const emp5Id = uuid();
const emp5ProfileId = uuid();

const emp6Id = uuid();
const emp6ProfileId = uuid();

// Companies
const company1Id = uuid();
const company1AddressId = uuid();

const company2Id = uuid();
const company2AddressId = uuid();

const company3Id = uuid();
const company3AddressId = uuid();

// Services — Company 1 (Salão de Beleza)
const svc1_1Id = uuid(); // Corte de cabelo 30min
const svc1_2Id = uuid(); // Coloração 90min
const svc1_3Id = uuid(); // Manicure 45min
const svc1_4Id = uuid(); // Pedicure 50min
const svc1_5Id = uuid(); // Escova 40min

// Services — Company 2 (Barbearia)
const svc2_1Id = uuid(); // Corte masculino 25min
const svc2_2Id = uuid(); // Barba 20min
const svc2_3Id = uuid(); // Corte + barba 40min
const svc2_4Id = uuid(); // Hidratação 30min

// Services — Company 3 (Clínica de Estética)
const svc3_1Id = uuid(); // Limpeza de pele 60min
const svc3_2Id = uuid(); // Peeling 45min
const svc3_3Id = uuid(); // Depilação pernas 50min
const svc3_4Id = uuid(); // Massagem 60min
const svc3_5Id = uuid(); // Drenagem 75min

// Appointments (all companies, various employees and clients, scattered across days)
const apt_ids = Array.from({ length: 33 }, () => uuid());

// ─── Data builders ────────────────────────────────────────────────────────────

async function buildProfiles(): Promise<Array<any>> {
  return [
    // Clients
    {
      id: client1ProfileId,
      fullName: 'Ana Paula Ferreira',
      cpf: '11122233344',
      phone: '11999990001',
      birthdate: '1992-03-15',
    },
    {
      id: client2ProfileId,
      fullName: 'Bruno Henrique Costa',
      cpf: '22233344455',
      phone: '11999990002',
      birthdate: '1988-07-22',
    },
    {
      id: client3ProfileId,
      fullName: 'Carla Mendes Oliveira',
      cpf: '33344455566',
      phone: '11999990003',
      birthdate: '1995-11-01',
    },
    {
      id: client4ProfileId,
      fullName: 'Diego Ramos Silva',
      cpf: '44455566677',
      phone: '11999990004',
      birthdate: '1990-05-30',
    },
    {
      id: client5ProfileId,
      fullName: 'Elisa Torres Nunes',
      cpf: '55566677788',
      phone: '11999990005',
      birthdate: '1997-09-18',
    },
    // Employees
    {
      id: emp1ProfileId,
      fullName: 'Fernanda Lima Barros',
      cpf: '66677788899',
      phone: '11999990011',
      birthdate: '1985-02-10',
    },
    {
      id: emp2ProfileId,
      fullName: 'Gabriel Souza Pinto',
      cpf: '77788899900',
      phone: '11999990012',
      birthdate: '1990-06-25',
    },
    {
      id: emp3ProfileId,
      fullName: 'Helena Castro Meireles',
      cpf: '88899900011',
      phone: '11999990013',
      birthdate: '1993-12-05',
    },
    {
      id: emp4ProfileId,
      fullName: 'Igor Alves Lemos',
      cpf: '99900011122',
      phone: '11999990014',
      birthdate: '1987-08-14',
    },
    {
      id: emp5ProfileId,
      fullName: 'Juliana Freitas Duarte',
      cpf: '10011122233',
      phone: '11999990015',
      birthdate: '1991-04-03',
    },
    {
      id: emp6ProfileId,
      fullName: 'Kleber Vieira Cunha',
      cpf: '11122233345',
      phone: '11999990016',
      birthdate: '1983-01-20',
    },
  ];
}

async function buildUsers(clientRole: Role): Promise<Array<any>> {
  const pass = await hash('Test*123@', hashConfig.config.salt);

  return [
    // Clients
    {
      id: client1Id,
      email: 'ana.paula@dev.com',
      password: pass,
      profileId: client1ProfileId,
      roleId: clientRole.id,
    },
    {
      id: client2Id,
      email: 'bruno.costa@dev.com',
      password: pass,
      profileId: client2ProfileId,
      roleId: clientRole.id,
    },
    {
      id: client3Id,
      email: 'carla.mendes@dev.com',
      password: pass,
      profileId: client3ProfileId,
      roleId: clientRole.id,
    },
    {
      id: client4Id,
      email: 'diego.ramos@dev.com',
      password: pass,
      profileId: client4ProfileId,
      roleId: clientRole.id,
    },
    {
      id: client5Id,
      email: 'elisa.torres@dev.com',
      password: pass,
      profileId: client5ProfileId,
      roleId: clientRole.id,
    },
    // Employees
    {
      id: emp1Id,
      email: 'fernanda.lima@dev.com',
      password: pass,
      profileId: emp1ProfileId,
      roleId: clientRole.id,
    },
    {
      id: emp2Id,
      email: 'gabriel.souza@dev.com',
      password: pass,
      profileId: emp2ProfileId,
      roleId: clientRole.id,
    },
    {
      id: emp3Id,
      email: 'helena.castro@dev.com',
      password: pass,
      profileId: emp3ProfileId,
      roleId: clientRole.id,
    },
    {
      id: emp4Id,
      email: 'igor.alves@dev.com',
      password: pass,
      profileId: emp4ProfileId,
      roleId: clientRole.id,
    },
    {
      id: emp5Id,
      email: 'juliana.freitas@dev.com',
      password: pass,
      profileId: emp5ProfileId,
      roleId: clientRole.id,
    },
    {
      id: emp6Id,
      email: 'kleber.vieira@dev.com',
      password: pass,
      profileId: emp6ProfileId,
      roleId: clientRole.id,
    },
  ];
}

function buildAddresses(): Array<any> {
  return [
    {
      id: company1AddressId,
      street: 'Rua das Flores',
      number: 120,
      district: 'Centro',
      city: 'São Paulo',
      uf: 'SP',
      zipcode: '01310100',
      lat: -23.5505,
      lon: -46.6333,
    },
    {
      id: company2AddressId,
      street: 'Avenida Paulista',
      number: 900,
      district: 'Bela Vista',
      city: 'São Paulo',
      uf: 'SP',
      zipcode: '01310200',
      lat: -23.5632,
      lon: -46.6541,
    },
    {
      id: company3AddressId,
      street: 'Rua da Consolação',
      number: 450,
      district: 'Consolação',
      city: 'São Paulo',
      uf: 'SP',
      zipcode: '01301000',
      lat: -23.5489,
      lon: -46.6388,
    },
  ];
}

function buildCompanies(): Array<any> {
  return [
    {
      id: company1Id,
      corporateName: 'Salao Bela Arte Ltda',
      tradeName: 'Salao Bela Arte',
      cnpj: '11222333000101',
      status: CompanyStatus.ACTIVE,
      tolerance: '15min',
      addressId: company1AddressId,
      schedule: fullWeekSchedule,
    },
    {
      id: company2Id,
      corporateName: 'Barbearia Estilo Corte Ltda',
      tradeName: 'Barbearia Estilo Corte',
      cnpj: '22333444000102',
      tolerance: '5min',
      status: CompanyStatus.ACTIVE,
      addressId: company2AddressId,
      schedule: compactSchedule,
    },
    {
      id: company3Id,
      corporateName: 'Clinica Pelle Nobile Ltda',
      tradeName: 'Pelle Nobile Estetica',
      cnpj: '33444555000103',
      tolerance: '30s',
      status: CompanyStatus.ACTIVE,
      addressId: company3AddressId,
      schedule: extendedSchedule,
    },
  ];
}

function buildServices(): Array<any> {
  return [
    // Company 1 — Salão
    {
      id: svc1_1Id,
      companyId: company1Id,
      name: 'Corte feminino',
      description: 'Corte de cabelo feminino personalizado',
      durationInMinutes: 30,
      price: 80,
      status: ServiceStatus.AVAILABLE,
    },
    {
      id: svc1_2Id,
      companyId: company1Id,
      name: 'Coloração completa',
      description: 'Coloração de raiz a ponta com produto premium',
      durationInMinutes: 90,
      price: 220,
      status: ServiceStatus.AVAILABLE,
    },
    {
      id: svc1_3Id,
      companyId: company1Id,
      name: 'Manicure',
      description: 'Esmaltação e cuidados com as unhas das mãos',
      durationInMinutes: 45,
      price: 45,
      status: ServiceStatus.AVAILABLE,
    },
    {
      id: svc1_4Id,
      companyId: company1Id,
      name: 'Pedicure',
      description: 'Esmaltação e cuidados com as unhas dos pés',
      durationInMinutes: 50,
      price: 55,
      status: ServiceStatus.AVAILABLE,
    },
    {
      id: svc1_5Id,
      companyId: company1Id,
      name: 'Escova progressiva',
      description: 'Escova com produto de alisamento duradouro',
      durationInMinutes: 40,
      price: 150,
      status: ServiceStatus.AVAILABLE,
    },

    // Company 2 — Barbearia
    {
      id: svc2_1Id,
      companyId: company2Id,
      name: 'Corte masculino',
      description: 'Corte clássico ou moderno a escolha do cliente',
      durationInMinutes: 25,
      price: 50,
      status: ServiceStatus.AVAILABLE,
    },
    {
      id: svc2_2Id,
      companyId: company2Id,
      name: 'Barba completa',
      description: 'Modelagem e aparagem de barba com navalha',
      durationInMinutes: 20,
      price: 35,
      status: ServiceStatus.AVAILABLE,
    },
    {
      id: svc2_3Id,
      companyId: company2Id,
      name: 'Corte + barba',
      description: 'Pacote completo corte e barba',
      durationInMinutes: 40,
      price: 75,
      status: ServiceStatus.AVAILABLE,
    },
    {
      id: svc2_4Id,
      companyId: company2Id,
      name: 'Hidratação capilar',
      description: 'Tratamento de hidratação profunda para cabelos',
      durationInMinutes: 30,
      price: 60,
      status: ServiceStatus.AVAILABLE,
    },

    // Company 3 — Estética
    {
      id: svc3_1Id,
      companyId: company3Id,
      name: 'Limpeza de pele',
      description: 'Limpeza profunda facial com extração de cravos',
      durationInMinutes: 60,
      price: 180,
      status: ServiceStatus.AVAILABLE,
    },
    {
      id: svc3_2Id,
      companyId: company3Id,
      name: 'Peeling quimico',
      description: 'Renovacao celular com acidos especificos',
      durationInMinutes: 45,
      price: 250,
      status: ServiceStatus.AVAILABLE,
    },
    {
      id: svc3_3Id,
      companyId: company3Id,
      name: 'Depilacao pernas',
      description: 'Depilacao completa das pernas com cera quente',
      durationInMinutes: 50,
      price: 120,
      status: ServiceStatus.AVAILABLE,
    },
    {
      id: svc3_4Id,
      companyId: company3Id,
      name: 'Massagem relaxante',
      description: 'Massagem corporal com oleos essenciais',
      durationInMinutes: 60,
      price: 200,
      status: ServiceStatus.AVAILABLE,
    },
    {
      id: svc3_5Id,
      companyId: company3Id,
      name: 'Drenagem linfatica',
      description: 'Massagem de drenagem linfatica manual',
      durationInMinutes: 75,
      price: 230,
      status: ServiceStatus.AVAILABLE,
    },
  ];
}

function buildAppointments(): Array<any> {
  const apts: Array<any> = [];
  let i = 0;

  // ── Company 1, Employee 1 (emp1) ─────────────────────────────────────────
  apts.push(
    {
      id: apt_ids[i++],
      companyId: company1Id,
      employeeId: emp1Id,
      clientId: client1Id,
      serviceId: svc1_1Id,
      datetime: todayAt('09:00'),
      durationInMinutes: 30,
    },
    {
      id: apt_ids[i++],
      companyId: company1Id,
      employeeId: emp1Id,
      clientId: client2Id,
      serviceId: svc1_3Id,
      datetime: todayAt('10:00'),
      durationInMinutes: 45,
    },
    {
      id: apt_ids[i++],
      companyId: company1Id,
      employeeId: emp1Id,
      clientId: client3Id,
      serviceId: svc1_4Id,
      datetime: todayAt('11:30'),
      durationInMinutes: 50,
    },
    {
      id: apt_ids[i++],
      companyId: company1Id,
      employeeId: emp1Id,
      clientId: client4Id,
      serviceId: svc1_2Id,
      datetime: todayAt('14:00'),
      durationInMinutes: 90,
    },
    {
      id: apt_ids[i++],
      companyId: company1Id,
      employeeId: emp1Id,
      clientId: client5Id,
      serviceId: svc1_5Id,
      datetime: todayAt('16:30'),
      durationInMinutes: 40,
    },

    {
      id: apt_ids[i++],
      companyId: company1Id,
      employeeId: emp1Id,
      clientId: client1Id,
      serviceId: svc1_1Id,
      datetime: daysFromNowAt(1, '09:00'),
      durationInMinutes: 30,
    },
    {
      id: apt_ids[i++],
      companyId: company1Id,
      employeeId: emp1Id,
      clientId: client2Id,
      serviceId: svc1_3Id,
      datetime: daysFromNowAt(1, '14:00'),
      durationInMinutes: 45,
    },

    {
      id: apt_ids[i++],
      companyId: company1Id,
      employeeId: emp1Id,
      clientId: client3Id,
      serviceId: svc1_2Id,
      datetime: daysFromNowAt(2, '09:30'),
      durationInMinutes: 90,
    },
    {
      id: apt_ids[i++],
      companyId: company1Id,
      employeeId: emp1Id,
      clientId: client5Id,
      serviceId: svc1_4Id,
      datetime: daysFromNowAt(2, '13:00'),
      durationInMinutes: 50,
    },

    // ── Company 1, Employee 2 (emp2) ─────────────────────────────────────────
    {
      id: apt_ids[i++],
      companyId: company1Id,
      employeeId: emp2Id,
      clientId: client1Id,
      serviceId: svc1_1Id,
      datetime: todayAt('09:00'),
      durationInMinutes: 30,
    },
    {
      id: apt_ids[i++],
      companyId: company1Id,
      employeeId: emp2Id,
      clientId: client2Id,
      serviceId: svc1_3Id,
      datetime: todayAt('09:45'),
      durationInMinutes: 45,
    },
    {
      id: apt_ids[i++],
      companyId: company1Id,
      employeeId: emp2Id,
      clientId: client3Id,
      serviceId: svc1_2Id,
      datetime: todayAt('14:00'),
      durationInMinutes: 90,
    },
    {
      id: apt_ids[i++],
      companyId: company1Id,
      employeeId: emp2Id,
      clientId: client4Id,
      serviceId: svc1_5Id,
      datetime: todayAt('16:00'),
      durationInMinutes: 40,
    },

    {
      id: apt_ids[i++],
      companyId: company1Id,
      employeeId: emp2Id,
      clientId: client5Id,
      serviceId: svc1_1Id,
      datetime: daysFromNowAt(1, '10:00'),
      durationInMinutes: 30,
    },
    {
      id: apt_ids[i++],
      companyId: company1Id,
      employeeId: emp2Id,
      clientId: client1Id,
      serviceId: svc1_4Id,
      datetime: daysFromNowAt(1, '15:00'),
      durationInMinutes: 50,
    },

    // ── Company 2, Employee 3 (emp3) ─────────────────────────────────────────
    {
      id: apt_ids[i++],
      companyId: company2Id,
      employeeId: emp3Id,
      clientId: client1Id,
      serviceId: svc2_3Id,
      datetime: todayAt('09:00'),
      durationInMinutes: 40,
    },
    {
      id: apt_ids[i++],
      companyId: company2Id,
      employeeId: emp3Id,
      clientId: client2Id,
      serviceId: svc2_1Id,
      datetime: todayAt('10:00'),
      durationInMinutes: 25,
    },
    {
      id: apt_ids[i++],
      companyId: company2Id,
      employeeId: emp3Id,
      clientId: client3Id,
      serviceId: svc2_2Id,
      datetime: todayAt('11:00'),
      durationInMinutes: 20,
    },
    {
      id: apt_ids[i++],
      companyId: company2Id,
      employeeId: emp3Id,
      clientId: client4Id,
      serviceId: svc2_4Id,
      datetime: todayAt('13:00'),
      durationInMinutes: 30,
    },
    {
      id: apt_ids[i++],
      companyId: company2Id,
      employeeId: emp3Id,
      clientId: client5Id,
      serviceId: svc2_1Id,
      datetime: todayAt('14:30'),
      durationInMinutes: 25,
    },

    // ── Company 2, Employee 4 (emp4) ─────────────────────────────────────────
    {
      id: apt_ids[i++],
      companyId: company2Id,
      employeeId: emp4Id,
      clientId: client1Id,
      serviceId: svc2_3Id,
      datetime: todayAt('11:00'),
      durationInMinutes: 40,
    },
    {
      id: apt_ids[i++],
      companyId: company2Id,
      employeeId: emp4Id,
      clientId: client2Id,
      serviceId: svc2_1Id,
      datetime: todayAt('13:30'),
      durationInMinutes: 25,
    },
    {
      id: apt_ids[i++],
      companyId: company2Id,
      employeeId: emp4Id,
      clientId: client3Id,
      serviceId: svc2_2Id,
      datetime: todayAt('15:00'),
      durationInMinutes: 20,
    },
    {
      id: apt_ids[i++],
      companyId: company2Id,
      employeeId: emp4Id,
      clientId: client4Id,
      serviceId: svc2_4Id,
      datetime: daysFromNowAt(1, '09:00'),
      durationInMinutes: 30,
    },

    // ── Company 3, Employee 5 (emp5) ─────────────────────────────────────────
    {
      id: apt_ids[i++],
      companyId: company3Id,
      employeeId: emp5Id,
      clientId: client1Id,
      serviceId: svc3_1Id,
      datetime: todayAt('07:00'),
      durationInMinutes: 60,
    },
    {
      id: apt_ids[i++],
      companyId: company3Id,
      employeeId: emp5Id,
      clientId: client2Id,
      serviceId: svc3_2Id,
      datetime: todayAt('09:00'),
      durationInMinutes: 45,
    },
    {
      id: apt_ids[i++],
      companyId: company3Id,
      employeeId: emp5Id,
      clientId: client3Id,
      serviceId: svc3_3Id,
      datetime: todayAt('10:30'),
      durationInMinutes: 50,
    },
    {
      id: apt_ids[i++],
      companyId: company3Id,
      employeeId: emp5Id,
      clientId: client4Id,
      serviceId: svc3_4Id,
      datetime: todayAt('14:00'),
      durationInMinutes: 60,
    },
    {
      id: apt_ids[i++],
      companyId: company3Id,
      employeeId: emp5Id,
      clientId: client5Id,
      serviceId: svc3_5Id,
      datetime: todayAt('16:00'),
      durationInMinutes: 75,
    },

    // ── Company 3, Employee 6 (emp6) ─────────────────────────────────────────
    {
      id: apt_ids[i++],
      companyId: company3Id,
      employeeId: emp6Id,
      clientId: client1Id,
      serviceId: svc3_4Id,
      datetime: todayAt('08:00'),
      durationInMinutes: 60,
    },
    {
      id: apt_ids[i++],
      companyId: company3Id,
      employeeId: emp6Id,
      clientId: client2Id,
      serviceId: svc3_1Id,
      datetime: todayAt('10:00'),
      durationInMinutes: 60,
    },
    {
      id: apt_ids[i++],
      companyId: company3Id,
      employeeId: emp6Id,
      clientId: client3Id,
      serviceId: svc3_5Id,
      datetime: todayAt('13:00'),
      durationInMinutes: 75,
    },
    {
      id: apt_ids[i++],
      companyId: company3Id,
      employeeId: emp6Id,
      clientId: client4Id,
      serviceId: svc3_2Id,
      datetime: todayAt('15:30'),
      durationInMinutes: 45,
    },
  );

  return apts;
}

// ─── Pivot tables ─────────────────────────────────────────────────────────────

function buildCompaniesEmployees(): Array<{
  company_id: string;
  employee_id: string;
}> {
  return [
    { company_id: company1Id, employee_id: emp1Id },
    { company_id: company1Id, employee_id: emp2Id },
    { company_id: company2Id, employee_id: emp3Id },
    { company_id: company2Id, employee_id: emp4Id },
    { company_id: company3Id, employee_id: emp5Id },
    { company_id: company3Id, employee_id: emp6Id },
  ];
}

// ─── Seed functions ───────────────────────────────────────────────────────────

async function seedRole(trx: QueryRunner): Promise<Role> {
  const existing = await trx.manager.query(
    'SELECT * FROM roles WHERE type = ? LIMIT 1',
    [RoleType.CLIENT],
  );

  if (existing.length > 0) {
    console.log('Client role already exists — reusing');
    return existing[0];
  }

  const id = clientRoleId;
  const name = 'Client (dev)';
  const description = 'Role for development seed clients and employees';
  const type = RoleType.CLIENT;

  await trx.manager.query(
    'INSERT INTO roles (id, name, description, type) VALUES (?, ?, ?, ?)',
    [id, name, description, type],
  );
  console.log('Dev client role seeded');

  // Return a dummy object with the ID
  return { id, name, description, type } as Role;
}

async function seedProfiles(trx: QueryRunner): Promise<void> {
  const profiles = await buildProfiles();
  const values = profiles
    .map(
      p =>
        `('${p.id}', '${p.fullName}', '${p.cpf}', '${p.phone}', '${p.birthdate}')`,
    )
    .join(', ');
  await trx.manager.query(
    `INSERT INTO profiles (id, full_name, cpf, phone, birthdate) VALUES ${values}`,
  );
  console.log(`${profiles.length} profiles seeded`);
}

async function seedUsers(trx: QueryRunner, clientRole: Role): Promise<void> {
  const users = await buildUsers(clientRole);
  const values = users
    .map(
      u =>
        `('${u.id}', '${u.email}', '${u.password}', '${u.profileId}', '${u.roleId}')`,
    )
    .join(', ');
  await trx.manager.query(
    `INSERT INTO users (id, email, password, profile_id, role_id) VALUES ${values}`,
  );
  console.log(`${users.length} users seeded (5 clients + 6 employees)`);
}

async function seedAddresses(trx: QueryRunner): Promise<void> {
  const addresses = buildAddresses();
  const values = addresses
    .map(
      a =>
        `('${a.id}', '${a.street}', '${a.number}', '${a.district}', '${a.city}', '${a.uf}', '${a.zipcode}')`,
    )
    .join(', ');
  await trx.manager.query(
    `INSERT INTO addresses (id, street, number, district, city, uf, zipcode) VALUES ${values}`,
  );
  console.log(`${addresses.length} addresses seeded`);
}

async function seedCompanies(trx: QueryRunner): Promise<void> {
  const companies = buildCompanies();
  const values = companies
    .map(
      c =>
        `('${c.id}', '${c.corporateName}', '${c.tradeName}', '${c.cnpj}', '${
          c.status
        }', '${c.addressId}', '${JSON.stringify(c.schedule)}')`,
    )
    .join(', ');
  const escapedValues = values.replaceAll('\\', '\\\\');
  await trx.manager.query(
    `INSERT INTO companies (id, corporate_name, trade_name, cnpj, status, address_id, schedule) VALUES ${escapedValues}`,
  );
  console.log(`${companies.length} companies seeded`);
}

async function seedCompaniesEmployeesPivot(trx: QueryRunner): Promise<void> {
  const rows = buildCompaniesEmployees();
  const values = rows
    .map(r => `('${r.company_id}', '${r.employee_id}')`)
    .join(', ');
  await trx.manager.query(
    `INSERT INTO companies_employees (company_id, employee_id) VALUES ${values}`,
  );
  console.log(`${rows.length} companies_employees pivot rows seeded`);
}

async function seedServices(trx: QueryRunner): Promise<void> {
  const services = buildServices();
  const values = services
    .map(
      s =>
        `('${s.id}', '${s.companyId}', '${s.name}', '${s.description}', ${s.durationInMinutes}, ${s.price}, '${s.status}')`,
    )
    .join(', ');
  await trx.manager.query(
    `INSERT INTO services (id, company_id, name, description, duration_in_minutes, price, status) VALUES ${values}`,
  );
  console.log(`${services.length} services seeded`);
}

async function seedAppointments(trx: QueryRunner): Promise<void> {
  const appointments = buildAppointments();
  const values = appointments
    .map(
      a =>
        `('${a.id}', '${a.serviceId}', '${a.companyId}', '${a.employeeId}', '${a.clientId}', '${a.datetime}', ${a.durationInMinutes})`,
    )
    .join(', ');
  await trx.manager.query(
    `INSERT INTO appointments (id, service_id, company_id, employee_id, client_id, datetime, duration_in_minutes) VALUES ${values}`,
  );
  console.log(`${appointments.length} appointments seeded`);
}

// ─── Entry point ─────────────────────────────────────────────────────────────

export async function seedDevelopment(trx: QueryRunner): Promise<void> {
  console.log('\n🌱  Running development seed...');

  const clientRole = await seedRole(trx);
  await seedProfiles(trx);
  await seedUsers(trx, clientRole);
  await seedAddresses(trx);
  await seedCompanies(trx);
  await seedCompaniesEmployeesPivot(trx);
  await seedServices(trx);
  await seedAppointments(trx);

  console.log('\n✅  Development seed complete!\n');
}
