using my.bookshop as my from '../db/data-model';

@graphql
service CatalogService {
    @readonly entity Books as projection on my.Books;
}

annotate CatalogService.Books with {
  title @randomEmoji;
};