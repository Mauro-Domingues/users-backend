import { Router } from 'express';
import { CreateCompanyController } from '@modules/companies/services/createCompany/CreateCompanyController';
import { CreateServiceController } from '@modules/companies/services/createService/CreateServiceController';
import { DeleteCompanyController } from '@modules/companies/services/deleteCompany/DeleteCompanyController';
import { DeleteServiceController } from '@modules/companies/services/deleteService/DeleteServiceController';
import { ListCompanyController } from '@modules/companies/services/listCompany/ListCompanyController';
import { ListServiceController } from '@modules/companies/services/listService/ListServiceController';
import { ShowCompanyController } from '@modules/companies/services/showCompany/ShowCompanyController';
import { ShowServiceController } from '@modules/companies/services/showService/ShowServiceController';
import { UpdateCompanyController } from '@modules/companies/services/updateCompany/UpdateCompanyController';
import { UpdateServiceController } from '@modules/companies/services/updateService/UpdateServiceController';
import { createCompany } from '@modules/companies/validators/companies/createCompany';
import { deleteCompany } from '@modules/companies/validators/companies/deleteCompany';
import { listCompany } from '@modules/companies/validators/companies/listCompany';
import { showCompany } from '@modules/companies/validators/companies/showCompany';
import { updateCompany } from '@modules/companies/validators/companies/updateCompany';
import { createService } from '@modules/companies/validators/services/createService';
import { deleteService } from '@modules/companies/validators/services/deleteService';
import { listService } from '@modules/companies/validators/services/listService';
import { showService } from '@modules/companies/validators/services/showService';
import { updateService } from '@modules/companies/validators/services/updateService';

const companyRouter = Router();
const createCompanyController = new CreateCompanyController();
const listCompanyController = new ListCompanyController();
const showCompanyController = new ShowCompanyController();
const updateCompanyController = new UpdateCompanyController();
const deleteCompanyController = new DeleteCompanyController();
const createServiceController = new CreateServiceController();
const listServiceController = new ListServiceController();
const showServiceController = new ShowServiceController();
const updateServiceController = new UpdateServiceController();
const deleteServiceController = new DeleteServiceController();

companyRouter
  .route('/companies')
  .post(createCompany, createCompanyController.handle)
  .get(listCompany, listCompanyController.handle);

companyRouter
  .route('/companies/:id')
  .get(showCompany, showCompanyController.handle)
  .put(updateCompany, updateCompanyController.handle)
  .delete(deleteCompany, deleteCompanyController.handle);

companyRouter
  .route('/services')
  .post(createService, createServiceController.handle)
  .get(listService, listServiceController.handle);

companyRouter
  .route('/services/:id')
  .get(showService, showServiceController.handle)
  .put(updateService, updateServiceController.handle)
  .delete(deleteService, deleteServiceController.handle);

export { companyRouter };
import { CreateAppointmentController } from '@modules/companies/services/createAppointment/CreateAppointmentController';
import { DeleteAppointmentController } from '@modules/companies/services/deleteAppointment/DeleteAppointmentController';
import { ListAppointmentController } from '@modules/companies/services/listAppointment/ListAppointmentController';
import { ShowAppointmentController } from '@modules/companies/services/showAppointment/ShowAppointmentController';
import { UpdateAppointmentController } from '@modules/companies/services/updateAppointment/UpdateAppointmentController';
import { createAppointment } from '@modules/companies/validators/appointments/createAppointment';
import { deleteAppointment } from '@modules/companies/validators/appointments/deleteAppointment';
import { listAppointment } from '@modules/companies/validators/appointments/listAppointment';
import { showAppointment } from '@modules/companies/validators/appointments/showAppointment';
import { updateAppointment } from '@modules/companies/validators/appointments/updateAppointment';

const createAppointmentController = new CreateAppointmentController();
const listAppointmentController = new ListAppointmentController();
const showAppointmentController = new ShowAppointmentController();
const updateAppointmentController = new UpdateAppointmentController();
const deleteAppointmentController = new DeleteAppointmentController();

companyRouter
  .route('/appointments')
  .post(createAppointment, createAppointmentController.handle)
  .get(listAppointment, listAppointmentController.handle);

companyRouter
  .route('/appointments/:id')
  .get(showAppointment, showAppointmentController.handle)
  .put(updateAppointment, updateAppointmentController.handle)
  .delete(deleteAppointment, deleteAppointmentController.handle);
