import { BookBase } from './../models/book';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { SubSink } from 'subsink';
import { ToastrService } from 'ngx-toastr';
import { faSearch, faSync, faPlus, faInfo, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../services/data.services';

import { IBook, IBookmark } from '../models/book';

import { Subject } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css']
})
export class BookmarksComponent implements OnInit {

  constructor(private dataService: DataService, private toastr: ToastrService,
    private modalService: BsModalService
  ) {
    this.getAllBookmarks();
    this.searchStringChanged.pipe(
      debounceTime(200), // wait 200ms after the last event before emitting last event
      distinctUntilChanged()) // only emit if value is different from previous value
      .subscribe(str => { this.onSearchSystem(str); this.onSearchUser(str); });
  }

  faSearch = faSearch;
  faSync = faSync;
  faPlus = faPlus;
  faInfo = faInfo;
  faPencilAlt = faPencilAlt;
  faTrash = faTrash;

  bookmark: IBookmark;
  book: IBook;

  filteredBooks: IBook[];
  filteredBookmarks: IBookmark[];

  busy = false;

  searchString = '';
  searchStringChanged: Subject<string> = new Subject<string>();

  // tslint:disable-next-line: variable-name
  private _subs = new SubSink();
  // tslint:disable-next-line: variable-name
  private _books: IBook[] = [];
  // tslint:disable-next-line: variable-name
  private _bookmarks: IBookmark[] = [];

  aboutModalRef: BsModalRef;
  newBookmarkModalRef: BsModalRef;
  editBookmarkModalRef: BsModalRef;
  confirmDeleteModalRef: BsModalRef;

  async ngOnInit() {

  }

  getAllBookmarks() {
    this.getBookmarks();
    this.getUserBookmarks();
  }

  private getBookmarks() {
    this._bookmarks = null;
    this.filteredBookmarks = null;
    this._subs.sink = this.dataService.getBookmarks().subscribe(
      result => {
        this._bookmarks = result;
        this.onSearchSystem(this.searchString);
      },
      error => {
        console.error(error);
        this.toastr.error('Beim laden der System Lesenzeichen', 'Fehler!');
      }
    );
  }

  private getUserBookmarks() {
    this._books = null;
    this.filteredBooks = null;
    this._subs.sink = this.dataService.getUserBookmarks().subscribe(
      result => {
        this._books = result;
        this.onSearchUser(this.searchString);
      },
      error => {
        console.error(error);
        this.toastr.error('Beim laden der Persönlichen Lesenzeichen', 'Fehler!');
      }
    );
  }

  searchchanged(text: string) {
    this.searchStringChanged.next(text);
  }

  onSearchSystem(str: string) {
    this.filteredBookmarks = this._bookmarks.filter((book: IBookmark) => {
      return (book.titel && book.titel.toLowerCase().includes(str.toLowerCase())) ||
        (book.description && book.description.toLowerCase().includes(str.toLowerCase())) ||
        (book.tags && book.tags.toLowerCase().includes(str.toLowerCase())) ||
        (book.link && book.link.toLowerCase().includes(str.toLowerCase()));
    });
  }
  onSearchUser(str: string) {
    this.filteredBooks = this._books.filter((bookmark: IBook) => {
      return (bookmark.titel && bookmark.titel.toLowerCase().includes(str.toLowerCase())) ||
        (bookmark.description && bookmark.description.toLowerCase().includes(str.toLowerCase())) ||
        (bookmark.tags && bookmark.tags.toLowerCase().includes(str.toLowerCase())) ||
        (bookmark.link && bookmark.link.toLowerCase().includes(str.toLowerCase()));
    });
  }

  openAboutModal(template: TemplateRef<any>) {
    this.aboutModalRef = this.modalService.show(template);
  }
  openNewBookmarkModal(template: TemplateRef<any>) {
    this.book = new IBook();
    this.newBookmarkModalRef = this.modalService.show(template);
  }
  onSaveNewBookmark(book: IBook) {
    this.busy = true;
    this.dataService.addBookmark(book).subscribe(() => {
      this.busy = false;
      this.newBookmarkModalRef.hide();
      this.toastr.success('Lesenzeichen hinzugefügt');
      this.getUserBookmarks();
    },
      error => {
        this.busy = false;
        console.error(error);
        this.toastr.error(error.error, 'Fehler!');
      }
    );
  }
  openEditBookmarkModal(template: TemplateRef<any>, book: IBook) {
    this.book = book;
    this.editBookmarkModalRef = this.modalService.show(template);
  }
  onSaveEditBookmark(book: IBook) {
    this.busy = true;
    this.dataService.editBookmark(book).subscribe(() => {
      this.busy = false;
      this.editBookmarkModalRef.hide();
      this.toastr.success('Lesenzeichen gespeichert');
      this.getUserBookmarks();
    },
      error => {
        this.busy = false;
        console.error(error);
        this.toastr.error(error.error, 'Fehler!');
      }
    );
  }
  openDeleteBookmarkModal(template: TemplateRef<any>, book: IBook) {
    this.book = book;
    this.confirmDeleteModalRef = this.modalService.show(template);
  }

  confirm(): void {
    this.busy = true;
    this.dataService.deleteUserBookmark(this.book).subscribe(() => {
      this.busy = false;
      this.confirmDeleteModalRef.hide();
      this.toastr.info('Lesenzeichen gelöscht');
      this.getUserBookmarks();
    },
      error => {
        this.busy = false;
        console.error(error);
        this.toastr.error(error.error, 'Fehler!');
      }
    );
  }

  onTileClick(data: BookBase): void {
    window.open(data.link, '_blank');
  }
}
