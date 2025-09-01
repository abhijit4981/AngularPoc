import { AppConfigService } from './app-config.service';

export function InitFactory(configService: AppConfigService) {
    return () => configService.load();
}
