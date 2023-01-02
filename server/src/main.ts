import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import session from "express-session";
import * as mongoose from "mongoose";
import MongoStore from "connect-mongo";
import { COOKIE_NAME, __prod__ } from "./constants";
//add "esModuleInterop": true in tsconfig.json

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //session
  mongoose.set("strictQuery", false);
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected..."))
    .catch((err) => console.log(err));
  app.use(
    session({
      name: COOKIE_NAME,
      store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
      cookie: {
        maxAge: 1000 * 60 * 60, //1 hour
        httpOnly: true,
        secure: __prod__,
        sameSite: "lax",
      },
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false, //don't save empty sessions, right from to the start
      resave: false,
    })
  );

  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true,
  });

  await app.listen(process.env.PORT);
}
bootstrap();
