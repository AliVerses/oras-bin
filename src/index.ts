import { configureOras } from './download';

configureOras().catch(err => {
  console.error(err);
  process.exit(1);
});