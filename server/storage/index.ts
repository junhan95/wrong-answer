import { BaseStorage } from "./base";
import { UsersMixin } from "./users.storage";
import { SubscriptionsMixin } from "./subscriptions.storage";
import { WrongAnswersMixin } from "./wrong-answers.storage";
import { TutorSessionMixin } from "./tutor.storage";
import { FamilyMixin } from "./family.storage";

export type { IStorage } from "./types";

function applyMixins(derivedCtor: any, constructors: any[]) {
    constructors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            if (name !== "constructor") {
                Object.defineProperty(
                    derivedCtor.prototype,
                    name,
                    Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
                    Object.create(null)
                );
            }
        });
    });
}

export class DatabaseStorage extends BaseStorage {
    constructor() {
        super();
    }
}

export interface DatabaseStorage
    extends UsersMixin,
    SubscriptionsMixin,
    WrongAnswersMixin,
    TutorSessionMixin,
    FamilyMixin { }

applyMixins(DatabaseStorage, [
    UsersMixin,
    SubscriptionsMixin,
    WrongAnswersMixin,
    TutorSessionMixin,
    FamilyMixin,
]);

export const storage = new DatabaseStorage();
