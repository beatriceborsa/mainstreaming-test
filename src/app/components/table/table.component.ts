import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Content } from 'src/app/model/content.model';
import { interval, Subscription } from 'rxjs';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {
  data: Content[] = [];
  filteredData: Content[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 10;
  search: string = '';
  progress = 100;
  secondsLeft = 60;
  pages: number[] = [];
  countdown = 60;
  intervalSub!: Subscription;



  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.contents$.subscribe((contents: Content[]) => {
      localStorage.setItem('lastFetch', Date.now().toString());
      this.data = contents;
      this.filter();
    });
    this.startCountdown();
  }

  filter(): void {
    this.filteredData = this.data.filter(item =>
      item.title.toLowerCase().includes(this.search.toLowerCase())
    );

    this.pages = Array(Math.ceil(this.filteredData.length / this.itemsPerPage))
      .fill(0)
      .map((_, i) => i);

    this.currentPage = 0;
  }

  paginatedData(): Content[] {
    const start = this.currentPage * this.itemsPerPage;
    return this.filteredData.slice(start, start + this.itemsPerPage);
  }

  startCountdown(): void {
    const lastFetch = localStorage.getItem('lastFetch');
    const now = Date.now();

    if (lastFetch) {
      const elapsed = Math.floor((now - parseInt(lastFetch, 10)) / 1000);
      this.countdown = 60 - elapsed;

      if (this.countdown <= 0) {
        this.countdown = 60;
      }
    }

    // Aggiorno ogni secondo
    this.intervalSub = interval(1000).subscribe(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        this.countdown = 60;
        localStorage.setItem('lastFetch', Date.now().toString());
      }
    });
  }

  setPage(index: number): void {
    this.currentPage = index;
  }

  nextPage(): void {
    if (this.currentPage < this.pages.length - 1) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

}
