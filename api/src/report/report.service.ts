import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import puppeteer, { Browser } from 'puppeteer';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportService implements OnModuleDestroy {
  private readonly logger = new Logger(ReportService.name);
  private browser: Browser | null = null;
  private browserPromise: Promise<Browser> | null = null;

  private summaryCache: { data: any; timestamp: number } | null = null;
  private readonly CACHE_TTL = 30000; // 30 seconds

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleDestroy() {
    await this.closeBrowser();
  }

  private async getBrowser(): Promise<Browser> {
    if (this.browser && this.browser.connected) {
      return this.browser;
    }

    if (this.browserPromise) {
      return this.browserPromise;
    }

    this.browserPromise = puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-extensions',
      ],
    });

    this.browser = await this.browserPromise;
    this.browserPromise = null;

    this.browser.on('disconnected', () => {
      this.browser = null;
    });

    return this.browser;
  }

  private async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async getUsersData() {
    return this.userRepository.find({
      select: {
        id: true,
        email: true,
        name: true,
        tel: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  private generateUsersHtml(users: any[]): string {
    const adminCount = users.filter((u) => u.role === 'ADMIN').length;
    const managerCount = users.filter((u) => u.role === 'MANAGER').length;
    const userCount = users.filter((u) => u.role === 'USER').length;

    const tableRows = users
      .map(
        (user) => `
        <tr>
          <td>${user.id}</td>
          <td>${user.name || '-'}</td>
          <td>${user.email}</td>
          <td>${user.tel || '-'}</td>
          <td><span class="badge badge-${user.role.toLowerCase()}">${user.role}</span></td>
          <td>${new Date(user.createdAt).toLocaleDateString('th-TH')}</td>
          <td>${new Date(user.updatedAt).toLocaleDateString('th-TH')}</td>
        </tr>
      `,
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Users Report</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            color: #333;
            background: #fff;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #4F81BD;
          }
          .header h1 {
            color: #4F81BD;
            font-size: 28px;
            margin-bottom: 10px;
          }
          .header .date {
            color: #666;
            font-size: 14px;
          }
          .summary {
            display: flex;
            justify-content: space-around;
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
          }
          .summary-item {
            text-align: center;
          }
          .summary-item .value {
            font-size: 32px;
            font-weight: bold;
            color: #4F81BD;
          }
          .summary-item .label {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            padding: 12px 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background: #4F81BD;
            color: white;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
          }
          tr:hover {
            background: #f5f5f5;
          }
          tr:nth-child(even) {
            background: #fafafa;
          }
          .badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
          }
          .badge-admin {
            background: #dc3545;
            color: white;
          }
          .badge-manager {
            background: #ffc107;
            color: #333;
          }
          .badge-user {
            background: #28a745;
            color: white;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #999;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 Users Report</h1>
          <p class="date">Generated: ${new Date().toLocaleString('th-TH')}</p>
        </div>

        <div class="summary">
          <div class="summary-item">
            <div class="value">${users.length}</div>
            <div class="label">Total Users</div>
          </div>
          <div class="summary-item">
            <div class="value">${adminCount}</div>
            <div class="label">Admins</div>
          </div>
          <div class="summary-item">
            <div class="value">${managerCount}</div>
            <div class="label">Managers</div>
          </div>
          <div class="summary-item">
            <div class="value">${userCount}</div>
            <div class="label">Users</div>
          </div>
        </div>

        <h2 style="color: #4F81BD; margin-bottom: 10px;">User List</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="footer">
          <p>© 2026 Nest Auth System - All Rights Reserved</p>
        </div>
      </body>
      </html>
    `;
  }

  async generateUsersPdf(): Promise<Buffer> {
    const users = await this.getUsersData();
    const html = this.generateUsersHtml(users);

    this.logger.log('Starting PDF generation with Puppeteer...');

    let browser;
    let page;
    
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
        ],
      });

      page = await browser.newPage();

      await page.setContent(html, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm',
        },
      });

      this.logger.log('PDF generated successfully');
      return Buffer.from(pdfBuffer);
      
    } catch (error) {
      this.logger.error('Failed to generate PDF', error);
      throw new Error(`PDF generation failed: ${error.message}`);
    } finally {
      if (browser) {
        try {
          await browser.close();
        } catch (e) {
          this.logger.warn('Failed to close browser');
        }
      }
    }
  }

  async generateUsersExcel(): Promise<Buffer> {
    const users = await this.getUsersData();

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Nest Auth System';
    workbook.created = new Date();

    const usersSheet = workbook.addWorksheet('Users');

    usersSheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 35 },
      { header: 'Phone', key: 'tel', width: 15 },
      { header: 'Role', key: 'role', width: 12 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Updated At', key: 'updatedAt', width: 20 },
    ];

    usersSheet.getRow(1).font = { bold: true };
    usersSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F81BD' },
    };
    usersSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Add data
    users.forEach((user) => {
      usersSheet.addRow({
        id: user.id,
        name: user.name || '-',
        email: user.email,
        tel: user.tel || '-',
        role: user.role,
        createdAt: new Date(user.createdAt).toLocaleString(),
        updatedAt: new Date(user.updatedAt).toLocaleString(),
      });
    });

    const summarySheet = workbook.addWorksheet('Summary');

    summarySheet.columns = [
      { header: 'Metric', key: 'metric', width: 25 },
      { header: 'Value', key: 'value', width: 15 },
    ];

    summarySheet.getRow(1).font = { bold: true };
    summarySheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F81BD' },
    };
    summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    const adminCount = users.filter((u) => u.role === 'ADMIN').length;
    const managerCount = users.filter((u) => u.role === 'MANAGER').length;
    const userCount = users.filter((u) => u.role === 'USER').length;

    summarySheet.addRow({ metric: 'Total Users', value: users.length });
    summarySheet.addRow({ metric: 'Admins', value: adminCount });
    summarySheet.addRow({ metric: 'Managers', value: managerCount });
    summarySheet.addRow({ metric: 'Users', value: userCount });
    summarySheet.addRow({
      metric: 'Report Generated',
      value: new Date().toLocaleString(),
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async getReportSummary() {
    // Check cache first
    if (
      this.summaryCache &&
      Date.now() - this.summaryCache.timestamp < this.CACHE_TTL
    ) {
      this.logger.log('Returning cached summary');
      return this.summaryCache.data;
    }

    const users = await this.getUsersData();

    const adminCount = users.filter((u) => u.role === 'ADMIN').length;
    const managerCount = users.filter((u) => u.role === 'MANAGER').length;
    const userCount = users.filter((u) => u.role === 'USER').length;

    const recentUsers = users.slice(0, 5).map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    }));

    const result = {
      totalUsers: users.length,
      byRole: {
        admin: adminCount,
        manager: managerCount,
        user: userCount,
      },
      recentUsers,
      generatedAt: new Date().toISOString(),
    };

    // Cache the result
    this.summaryCache = { data: result, timestamp: Date.now() };

    return result;
  }
}
