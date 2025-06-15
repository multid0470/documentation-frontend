import { Component, OnInit } from '@angular/core';
import { RepoService } from '../../services/repo.service';
import { DocumentService } from '../../services/document.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './upload.component.html'
})
export class UploadComponent implements OnInit {
  repoUrl = '';
  docs: any = null;
  loading = false;
  error = '';
  backendBaseUrl = 'http://localhost:8000';

  // Для генерации и списка документов
  genRepoUrl = '';
  genLoading = false;
  genError = '';
  genSuccess = false;
  documents: any[] = [];

  constructor(private repoService: RepoService, private documentService: DocumentService) {}

  ngOnInit() {
    this.loadDocuments();
  }

  onUpload() {
    if (!this.repoUrl) return;
    this.loading = true;
    this.error = '';
    this.repoService.uploadRepoUrl(this.repoUrl).subscribe({
      next: (data) => {
        if (data && (data.pdf_url || data.doc_url)) {
          if (data.pdf_url && !data.pdf_url.startsWith('http')) {
            data.pdf_url = this.backendBaseUrl + data.pdf_url;
          }
          if (data.doc_url && !data.doc_url.startsWith('http')) {
            data.doc_url = this.backendBaseUrl + data.doc_url;
          }
        }
        this.docs = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Ошибка загрузки';
        this.loading = false;
      }
    });
  }

  // Генерация документации
  generateDoc() {
    if (!this.genRepoUrl) return;
    this.genLoading = true;
    this.genError = '';
    this.genSuccess = false;
    this.documentService.generateDocs(this.genRepoUrl).subscribe({
      next: () => {
        this.genSuccess = true;
        this.genLoading = false;
        this.loadDocuments();
      },
      error: err => {
        this.genError = err.error?.error || 'Ошибка при генерации';
        this.genLoading = false;
      }
    });
  }

  loadDocuments() {
    this.documentService.getDocuments().subscribe(
      docs => this.documents = docs,
      error => console.error('Ошибка при загрузке документов:', error)
    );
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'В обработке',
      'completed': 'Завершено',
      'failed': 'Ошибка'
    };
    return statusMap[status] || status;
  }

  downloadPdf(doc: any) {
    this.documentService.downloadPdf(doc.id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${doc.title}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  downloadHtml(doc: any) {
    this.documentService.downloadHtml(doc.id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${doc.title}.html`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
