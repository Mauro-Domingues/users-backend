import { Router } from 'express';
import { accessControl } from '@middlewares/accessControl';
import { CreateAppointmentController } from '@modules/companies/services/createAppointment/CreateAppointmentController';
import { CreateCompanyController } from '@modules/companies/services/createCompany/CreateCompanyController';
import { CreateServiceController } from '@modules/companies/services/createService/CreateServiceController';
import { DeleteAppointmentController } from '@modules/companies/services/deleteAppointment/DeleteAppointmentController';
import { DeleteCompanyController } from '@modules/companies/services/deleteCompany/DeleteCompanyController';
import { DeleteServiceController } from '@modules/companies/services/deleteService/DeleteServiceController';
import { ListAppointmentController } from '@modules/companies/services/listAppointment/ListAppointmentController';
import { ListCompanyController } from '@modules/companies/services/listCompany/ListCompanyController';
import { ListServiceController } from '@modules/companies/services/listService/ListServiceController';
import { SelectServiceController } from '@modules/companies/services/selectService/SelectServiceController';
import { ShowAppointmentController } from '@modules/companies/services/showAppointment/ShowAppointmentController';
import { ShowCompanyController } from '@modules/companies/services/showCompany/ShowCompanyController';
import { ShowServiceController } from '@modules/companies/services/showService/ShowServiceController';
import { UpdateAppointmentController } from '@modules/companies/services/updateAppointment/UpdateAppointmentController';
import { UpdateCompanyController } from '@modules/companies/services/updateCompany/UpdateCompanyController';
import { UpdateServiceController } from '@modules/companies/services/updateService/UpdateServiceController';
import { createAppointment } from '@modules/companies/validators/appointments/createAppointment';
import { deleteAppointment } from '@modules/companies/validators/appointments/deleteAppointment';
import { listAppointment } from '@modules/companies/validators/appointments/listAppointment';
import { showAppointment } from '@modules/companies/validators/appointments/showAppointment';
import { updateAppointment } from '@modules/companies/validators/appointments/updateAppointment';
import { createCompany } from '@modules/companies/validators/companies/createCompany';
import { deleteCompany } from '@modules/companies/validators/companies/deleteCompany';
import { listCompany } from '@modules/companies/validators/companies/listCompany';
import { showCompany } from '@modules/companies/validators/companies/showCompany';
import { updateCompany } from '@modules/companies/validators/companies/updateCompany';
import { createService } from '@modules/companies/validators/services/createService';
import { deleteService } from '@modules/companies/validators/services/deleteService';
import { listService } from '@modules/companies/validators/services/listService';
import { selectService } from '@modules/companies/validators/services/selectService';
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
const selectServiceController = new SelectServiceController();
const showServiceController = new ShowServiceController();
const updateServiceController = new UpdateServiceController();
const deleteServiceController = new DeleteServiceController();
const createAppointmentController = new CreateAppointmentController();
const listAppointmentController = new ListAppointmentController();
const showAppointmentController = new ShowAppointmentController();
const updateAppointmentController = new UpdateAppointmentController();
const deleteAppointmentController = new DeleteAppointmentController();

companyRouter.get(
  '/select-services',
  selectService,
  selectServiceController.handle,
);

companyRouter
  .route('/companies')
  .post(accessControl, createCompany, createCompanyController.handle)
  .get(listCompany, listCompanyController.handle);

companyRouter
  .route('/companies/:id')
  .get(showCompany, showCompanyController.handle)
  .put(accessControl, updateCompany, updateCompanyController.handle)
  .delete(accessControl, deleteCompany, deleteCompanyController.handle);

companyRouter
  .route('/services')
  .post(accessControl, createService, createServiceController.handle)
  .get(accessControl, listService, listServiceController.handle);

companyRouter
  .route('/services/:id')
  .get(accessControl, showService, showServiceController.handle)
  .put(accessControl, updateService, updateServiceController.handle)
  .delete(accessControl, deleteService, deleteServiceController.handle);

companyRouter
  .route('/appointments')
  .post(accessControl, createAppointment, createAppointmentController.handle)
  .get(accessControl, listAppointment, listAppointmentController.handle);

companyRouter
  .route('/appointments/:id')
  .get(accessControl, showAppointment, showAppointmentController.handle)
  .put(accessControl, updateAppointment, updateAppointmentController.handle)
  .delete(accessControl, deleteAppointment, deleteAppointmentController.handle);

export { companyRouter };
