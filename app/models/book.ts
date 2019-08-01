export class BookBase {
    link: string;
    titel: string;
    description: string;
    tags: string;
    guid: string;
}

export class IBook extends BookBase {
    username: string;
}

export class IBookmark extends BookBase {
    keycloakClient: string;
}
