import {
  Controller,
  Get,
  Res,
  UseGuards,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { ReportService } from './report.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../entities/user.entity';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportController {
  private readonly logger = new Logger(ReportController.name);

  constructor(private readonly reportService: ReportService) {}

  @Get('summary')
  async getSummary() {
    try {
      return await this.reportService.getReportSummary();
    } catch (error) {
      this.logger.error('Failed to get report summary', error);
      throw new HttpException(
        'Failed to generate report summary',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('users/pdf')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async downloadUsersPdf(@Res() res: Response) {
    try {
      this.logger.log('Generating PDF report...');
      const buffer = await this.reportService.generateUsersPdf();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=users-report-${Date.now()}.pdf`,
        'Content-Length': buffer.length,
      });

      res.end(buffer);
    } catch (error) {
      this.logger.error('Failed to generate PDF report', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to generate PDF report',
        error: error.message,
      });
    }
  }

  @Get('users/excel')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async downloadUsersExcel(@Res() res: Response) {
    try {
      this.logger.log('Generating Excel report...');
      const buffer = await this.reportService.generateUsersExcel();

      res.set({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=users-report-${Date.now()}.xlsx`,
        'Content-Length': buffer.length,
      });

      res.end(buffer);
    } catch (error) {
      this.logger.error('Failed to generate Excel report', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to generate Excel report',
        error: error.message,
      });
    }
  }
}
