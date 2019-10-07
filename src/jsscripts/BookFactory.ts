class Novel {
}

class Thriller {
}

class BookFactory {
    private createBook: (type) => any;

    constructor() {
        this.createBook = function(type) {
            let book;
            if(type === 'comedy' || type === 'romantic') book = new Novel();
            else if (type === 'action') book = new Thriller();
            return book;
        };
    }


}