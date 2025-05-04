import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('App E2E Tests', () => {
  beforeAll(async () => {
    // Setup code before all tests run
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });
  it.todo('Should run the application');
});
