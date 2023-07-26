"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const typeDefs_1 = require("./graphQL/typeDefs");
const resolvers_1 = require("./graphQL/resolvers");
const database_1 = require("./config1/database");
const graphql_1 = require("graphql");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
exports.app = (0, express_1.default)();
(0, database_1.connectDatabase)();
//this function helps to connect to the servers 
exports.app.use((0, morgan_1.default)('dev'));
exports.app.use(express_1.default.json());
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// app.use('/books', bookRoutes);
// app.use('/users', usersRoutes);
//this is ap
const server = new server_1.ApolloServer({
    typeDefs: typeDefs_1.typeDefs,
    resolvers: resolvers_1.resolvers,
});
(async () => {
    const { url } = await (0, standalone_1.startStandaloneServer)(server, { context: async ({ req }) => {
            const token = req.headers.authorization || '';
            if (token) {
                const decoded = jsonwebtoken_1.default.verify(token, `${process.env.APP_SECRET}`);
                if (decoded)
                    return { decoded };
                if (!decoded) {
                    throw new graphql_1.GraphQLError('User is not authenticated', {
                        extensions: {
                            code: 'UNAUTHENTICATED',
                            http: { status: 401 },
                        },
                    });
                }
            }
        }
    });
    console.log(`server ready at ${url}`);
})();
// function getUser(token: string) {
//   throw new Error('Function not implemented.');
// }
// , {
