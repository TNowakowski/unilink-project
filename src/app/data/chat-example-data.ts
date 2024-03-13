/* tslint:disable:max-line-length */
import { User } from "../user/user.model";
import { Thread } from "../thread/thread.model";
import { Message } from "../message/message.model";
import { MessagesService } from "../message/messages.service";
import { ThreadsService } from "../thread/threads.service";
import { UsersService } from "../user/users.service";
import * as moment from "moment";
const me: User = new User("Magda", "assets/images/avatars/female-avatar-1.png");
const hrab: User = new User(
  "Hrabina",
  "assets/images/avatars/female-avatar-2.png"
);
const echo: User = new User("Echo", "assets/images/avatars/male-avatar-1.png");
const rev: User = new User(
  "Mateusz Odwrotny",
  "assets/images/avatars/female-avatar-4.png"
);
const wait: User = new User(
  "Zbigniew Poczekalski",
  "assets/images/avatars/male-avatar-2.png"
);

const tHrab: Thread = new Thread("tLadycap", hrab.name, hrab.avatarSrc);
const tEcho: Thread = new Thread("tEcho", echo.name, echo.avatarSrc);
const tRev: Thread = new Thread("tRev", rev.name, rev.avatarSrc);
const tWait: Thread = new Thread("tWait", wait.name, wait.avatarSrc);

const initialMessages: Array<Message> = [
  new Message({
    author: me,
    sentAt: moment().subtract(45, "minutes").toDate(),
    text: "Mości Hrabio",
    thread: tHrab,
  }),
  new Message({
    author: hrab,
    sentAt: moment().subtract(20, "minutes").toDate(),
    text: "W sukurs!",
    thread: tHrab,
  }),
  new Message({
    author: echo,
    sentAt: moment().subtract(1, "minutes").toDate(),
    text: "Odpowiem na wszystko co mi wyślesz",
    thread: tEcho,
  }),
  new Message({
    author: rev,
    sentAt: moment().subtract(3, "minutes").toDate(),
    text: "Odwrócę wszystko co mi wyślesz",
    thread: tRev,
  }),
  new Message({
    author: wait,
    sentAt: moment().subtract(4, "minutes").toDate(),
    text: "Poczekam tyle sekund ile my wyślesz. Spróbuj wysłać mi liczbę np. 3",
    thread: tWait,
  }),
];

export class ChatExampleData {
  static init(
    messagesService: MessagesService,
    threadsService: ThreadsService,
    UsersService: UsersService
  ): void {
    messagesService.messages.subscribe(() => ({}));
    UsersService.setCurrentUser(me);
    initialMessages.map((message: Message) =>
      messagesService.addMessage(message)
    );
    threadsService.setCurrentThread(tEcho);
    this.setupBots(messagesService);
  }
  static setupBots(messagesService: MessagesService): void {
    messagesService
      .messagesForThreadUser(tEcho, echo)
      .forEach((message: Message): void => {
        messagesService.addMessage(
          new Message({
            author: echo,
            text: message.text,
            thread: tEcho,
          })
        );
      }, null);
    messagesService
      .messagesForThreadUser(tRev, rev)
      .forEach((message: Message): void => {
        messagesService.addMessage(
          new Message({
            author: rev,
            text: message.text.split("").reverse().join(""),
            thread: tRev,
          })
        );
      }, null);
    messagesService
      .messagesForThreadUser(tWait, wait)
      .forEach((message: Message): void => {
        let waitTime: number = parseInt(message.text, 10);
        let reply: string;

        if (isNaN(waitTime)) {
          waitTime = 0;
          reply = `Nie rozumiem: ${message.text}. Wyślij mi liczbę`;
        } else {
          reply = `Czekałem ${waitTime} sekund żeby Ci to wysłać`;
        }

        setTimeout(() => {
          messagesService.addMessage(
            new Message({
              author: wait,
              text: reply,
              thread: tWait,
            })
          );
        }, waitTime * 1000);
      }, null);
  }
}
