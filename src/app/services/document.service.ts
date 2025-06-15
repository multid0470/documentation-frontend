import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private apiUrl = 'http://localhost:8000/api/documents';

  constructor(private http: HttpClient) {}

  generateDocs(repoUrl: string): Observable<any> {
    // 🔧 Исправлено: repo_url → repo_path
    return this.http.post<any>(`${this.apiUrl}/generate/`, { repo_path: repoUrl });
  }

  getDocuments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  downloadPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download_pdf`, { responseType: 'blob' });
  }

  downloadHtml(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download_html`, { responseType: 'blob' });
  }
}
