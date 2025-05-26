import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Content } from 'src/app/model/content.model';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {
  data: Content[] = [];
  filteredData: Content[] = [];
  currentPage = 0;
  itemsPerPage = 10;
  search: string = '';
  progress = 100;
  secondsLeft = 60;
  pages: number[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.contents$.subscribe(data => {
      this.data = data;
      this.applyFilter();
    });
    this.startCountdown();
  }

  applyFilter() {
    this.filteredData = this.data.filter(item =>
      item.title.toLowerCase().includes(this.search.toLowerCase())
    );
    this.pages = Array(Math.ceil(this.filteredData.length / this.itemsPerPage))
      .fill(0)
      .map((_, i) => i);
  }

  paginatedData(): Content[] {
    const start = this.currentPage * this.itemsPerPage;
    return this.filteredData.slice(start, start + this.itemsPerPage);
  }

  onSearch() {
    this.currentPage = 0;
    this.applyFilter();
  }

  startCountdown() {
    const saved = localStorage.getItem('timerStart');
    const start = saved ? +saved : Date.now();
    localStorage.setItem('timerStart', start.toString());

    setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      this.progress = 100 - (elapsed % 60) * 100 / 60;
      this.secondsLeft = 60 - (elapsed % 60);
    }, 1000);
  }
}
