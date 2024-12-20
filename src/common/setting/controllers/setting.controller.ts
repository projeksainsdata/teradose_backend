import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Setting } from '@prisma/client';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import {
    Response,
    ResponsePaging,
} from 'src/common/response/decorators/response.decorator';
import {
    IResponse,
    IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import {
    SETTING_DEFAULT_AVAILABLE_ORDER_BY,
    SETTING_DEFAULT_AVAILABLE_SEARCH,
    SETTING_DEFAULT_ORDER_BY,
    SETTING_DEFAULT_ORDER_DIRECTION,
    SETTING_DEFAULT_PER_PAGE,
} from 'src/common/setting/constants/setting.list.constant';
import {
    GetSetting,
    SettingGetByNameGuard,
    SettingGetGuard,
} from 'src/common/setting/decorators/setting.decorator';
import {
    SettingGetByNameDoc,
    SettingGetDoc,
    SettingListDoc,
} from 'src/common/setting/docs/setting.doc';
import { SettingRequestDto } from 'src/common/setting/dtos/setting.request.dto';
import { SettingGetSerialization } from 'src/common/setting/serializations/setting.get.serialization';
import { SettingListSerialization } from 'src/common/setting/serializations/setting.list.serialization';
import { SettingService } from 'src/common/setting/services/setting.service';

@ApiTags('setting')
@Controller({
    version: '1',
    path: '/settings',
})
export class SettingController {
    constructor(
        private readonly settingService: SettingService,
        private readonly paginationService: PaginationService
    ) {}

    @SettingListDoc()
    @ResponsePaging('setting.list', {
        serialization: SettingListSerialization,
    })
    @Get('/')
    async list(
        @PaginationQuery(
            SETTING_DEFAULT_PER_PAGE,
            SETTING_DEFAULT_ORDER_BY,
            SETTING_DEFAULT_ORDER_DIRECTION,
            SETTING_DEFAULT_AVAILABLE_SEARCH,
            SETTING_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDto
    ): Promise<IResponsePaging> {
        const find: Record<string, any> = {
            ..._search,
        };

        const settings: Setting[] = await this.settingService.findAll(find, {
            orderBy: _order,
            skip: _offset,
            take: _limit,
        });
        const total: number = await this.settingService.getTotal(find);
        const totalPage: number = this.paginationService.totalPage(
            total,
            _limit
        );

        return {
            _pagination: { total, totalPage },
            data: settings,
        };
    }

    @SettingGetDoc()
    @Response('setting.get', {
        serialization: SettingGetSerialization,
    })
    @SettingGetGuard()
    @RequestParamGuard(SettingRequestDto)
    @Get('/:setting')
    async get(@GetSetting(true) setting: Setting): Promise<IResponse> {
        return { data: setting };
    }

    @SettingGetByNameDoc()
    @Response('setting.getByName', {
        serialization: SettingGetSerialization,
    })
    @SettingGetByNameGuard()
    @Get('/name/:settingName')
    async getByName(@GetSetting(true) setting: Setting): Promise<IResponse> {
        return { data: setting };
    }
}
