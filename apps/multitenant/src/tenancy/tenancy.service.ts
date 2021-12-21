import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Connection, createConnection, createConnections } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { ReadTenantDto, CreateTenantDto } from './dto';
import { Tenancy } from './tenancy.entity';
import { User } from '../models/appBase/user.entity';

@Injectable()
export class TenancyService {
    constructor(
        @InjectRepository(Tenancy)
        private readonly tenantRepository: Repository<Tenancy>,
        private readonly configService: ConfigService,
    ) { }

    async findAll(): Promise<ReadTenantDto[]> {
        const tenants = await this.tenantRepository.find();

        return tenants.map(tenant => plainToClass(ReadTenantDto, tenant));
    }

    async findOne(enterprise: string) {
        return await this.tenantRepository.findOne({ enterprise });
    }


    async create(tenant: CreateTenantDto): Promise<ReadTenantDto> {
        const createdTenant = await this.tenantRepository.save(tenant);

        const dataBaseInfo: any = {
            host: this.configService.get('DB_HOST'),
            port: +this.configService.get('DB_PORT'),
            username: this.configService.get('DB_USER'),
            password: this.configService.get('DB_PASSWORD')
        };

        const appConnections: Connection[] = await createConnections([
            {
                type: 'mysql',
                name: 'appBase',
                ...dataBaseInfo,
                database: 'appBase'
            },
            {
                type: 'postgres',
                name: 'appA',
                ...dataBaseInfo,
                database: 'appA'
            },
            {
                type: 'mssql',
                name: 'appB',
                ...dataBaseInfo,
                database: 'appB'
            }
        ]);

        // console.log('appConnections', appConnections);

        if (!appConnections) {
            throw new BadRequestException(
                'Database Base Connection Error',
                'There is a error in the database!',
            );
        }


        await Promise.all(appConnections.map(async (conn) => {
            await conn.query(
                `CREATE SCHEMA "${tenant.enterprise}"`,
            );
            const nameConn = conn.name;
            await conn.close();

            const synchro = await createConnection({
                name: nameConn,
                ...dataBaseInfo,
                database: nameConn,
                schema: `${tenant.enterprise}`,
                entities: [User],
                // ssl: true,
                synchronize: true
            })
            synchro.close();
            return true;
        }));

        return plainToClass(ReadTenantDto, createdTenant);
    }

}
