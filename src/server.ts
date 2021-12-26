import 'module-alias/register';
import App from './app';
import ContractController from '@controllers/ContractController';
import JobController from '@controllers/JobController';
import BalanceController from '@controllers/BalanceController';
import AdminController from '@controllers/AdminController';


// Start the server
const app = new App(
  [
    new ContractController(),
    new JobController(),
    new BalanceController(),
    new AdminController()
  ],
);

init();

async function init() {
  try {
    app.listen();
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}
