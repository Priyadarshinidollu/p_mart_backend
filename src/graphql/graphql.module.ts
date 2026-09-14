import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";

@Module({
    imports:[
         GraphQLModule.forRootAsync<ApolloDriverConfig>({
         
            driver: ApolloDriver,
            useFactory: () => ({
        //  context: ({ req, res }) => ({ req, res }),
         autoSchemaFile: true,
            }),
    }),
    ]
})
export class Graphql{}