import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";

@Module({
    imports:[
         GraphQLModule.forRootAsync<ApolloDriverConfig>({
         
            driver: ApolloDriver,
            useFactory: () => ({
         context: ({ req, res }: any) => ({ req, res }),
         autoSchemaFile: true,
            }),
    }),
    ]
})
export class Graphql{}