import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';

export class ElasticsearchHealthIndicator extends HealthIndicator {
  constructor(private readonly elasticsearchService: ElasticsearchService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.elasticsearchService.ping();

      return this.getStatus(key, true);
    } catch (err) {
      throw new HealthCheckError(
        'Elasticsearch Health check failed',
        this.getStatus(key, false),
      );
    }
  }
}
