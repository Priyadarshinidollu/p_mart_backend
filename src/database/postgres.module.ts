import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
        return {
          // logging:true,
          type: 'postgres',
          url: configService.get<string>('database.url'),
          //    port: 5432,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
  ],
})
export class PgModule {}
