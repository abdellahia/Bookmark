import { Injectable, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IBook, IBookmark } from '../models/book';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DataService {
  constructor(private http: HttpClient) { }

  @Input() // object to bind to internal methods

  baseUrl = 'assets/';
  bookmarks: IBookmark[] = [];
  bookmarkNew: IBookmark;
  private apiUrl = environment.apiUrl;

  getBookmarks(): Observable<IBookmark[]> {
    return this.http.get<IBookmark[]>(this.apiUrl + '/v1/SystemTiles');

  }

  getUserBookmarks(): Observable<IBook[]> {
    return this.http.get<IBook[]>(this.apiUrl + '/v1/UserTiles');

  }

  addBookmark(book: IBook) {
    const body = JSON.stringify(book);
    return this.http.post(this.apiUrl + '/v1/UserTiles/',
      body, httpOptions);
  }

  editBookmark(book: IBook) {
    console.log(book.guid);
    const body = JSON.stringify(book);
    return this.http.put(this.apiUrl + '/v1/UserTiles/' + book.guid,
      body, httpOptions);
  }

  saveBookmark(book: IBook) {
    const body = JSON.stringify(book);
    return this.http.post(this.apiUrl + '/v1/UserTiles/',
      body, httpOptions);
  }

  deleteUserBookmark(book: IBook) {
    console.log(book.guid);
    return this.http.delete(this.apiUrl + '/v1/UserTiles/' + book.guid,
      httpOptions);
  }
}
