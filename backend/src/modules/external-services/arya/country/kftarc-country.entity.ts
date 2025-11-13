import { Column, PrimaryColumn, Entity } from 'typeorm';

@Entity('THAryaCountryMapping', { database: 'SuccessProfile' })
export class KfhubCountryEntity {
    @PrimaryColumn({ name: 'CountryID' })
    CountryID: number;

    @Column({ name: 'CountryName' })
    CountryName: string;

    @Column({ name: 'CountryCode' })
    CountryCode: string;

    @Column({ name: 'AryaCountryId' })
    AryaCountryId: number;

    @Column({ name: 'AryaCountryName' })
    AryaCountryName: string;
}
