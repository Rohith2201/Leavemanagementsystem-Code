import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/components/app/app.component';
import { config } from './app.config'; 

bootstrapApplication(AppComponent, config)
  .catch(err => console.error(err));
