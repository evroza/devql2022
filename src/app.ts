import express from 'express';
import * as bodyParser from 'body-parser';
import { sequelize } from '@models/index';
import Controller from '@interfaces/Controller';
import config from './config';
import errorMiddleware from '@middlewares/ErrorHandlingMiddleware';


class App {
    public app: express.Application;
    private port: number;
  
    constructor(controllers: Controller[]) {
      this.app = express();
      this.port = Number(config.get('port'));
      this.app.get('/', (req, res) => res.send('Deel service API v1'));
  
      this.initializeMiddlewares();
      this.initializeControllers(controllers);
      this.initializeGlobals();
      this.initializeErrorHandling();
    }
  
    public listen() {
      this.app.listen(this.port, () => { 
        console.log(`Deel service listening on port ${this.port}!`)
      });
    }
  
    public getServer() {
      return this.app;
    }
  
    private initializeMiddlewares() {
      this.app.use(bodyParser.urlencoded({ extended: true }));
      this.app.use(bodyParser.json());
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
  
    private initializeGlobals() {
      this.app.set('sequelize', sequelize);
      this.app.set('models', sequelize.models);
    }
  
    private initializeControllers(controllers: Controller[]) {
      controllers.forEach((controller) => {
        this.app.use('/', controller.router);
      });
    }
}

export default App;
