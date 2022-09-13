import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: '5f5c7889-ae53-4042-8cc7-e643024904c0',
        description: 'Porduct uuid',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Porduct title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    title: string

    @ApiProperty({
        example: 0,
        description: 'Porduct price',
    })
    @Column('float',{
        default: 0
    })
    price:number

    @ApiProperty({
        example: 'Proident ea in officia minim nisi elit mollit eu.',
        description: 'Porduct description'
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Porduct SLUG- for SEO',
        uniqueItems: true
    })
    @Column('text',{
        unique: true
    })
    slug: string

    @ApiProperty({
        example: 10,
        description: 'Porduct stock',
        default: 0
    })
    @Column('int',{
        default: 0
    })
    stock: number

    @ApiProperty({
        example: ['M', 'XL', 'XXL'],
        description: 'Porduct sizes'
    })
    @Column('text',{
        array: true
    })
    sizes: string[]

    @ApiProperty({
        example: 'women',
        description: 'Porduct gender'
    })
    @Column('text')
    gender: string

    @ApiProperty()
    @Column('text',{
        array: true,
        default: []
    })
    tags: string[]

    @ApiProperty()
    @OneToMany(
        ()=> ProductImage,
        (productImage) => productImage.product,
        {cascade: true, eager: true}
    )
    images?: ProductImage[];

    @ManyToOne(
        ()=> User,
        (user)=> user.product,
        { eager: true }
    )
    user: User;

    @BeforeInsert()
    checkSlugInsert(){
        
      if(!this.slug){
        this.slug = this.title
      }
      this.slug = this.slug.toLowerCase().replaceAll(' ','_').replaceAll("'", '')
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug.toLowerCase().replaceAll(' ','_').replaceAll("'", '')
    }
}
