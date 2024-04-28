import { QuasmComponent } from './Structure';

interface ApiResponse<Payload> {
    success: boolean;
    payload?: Payload;
    error?: {
        location: QuasmComponent;
        code: number;
        message: string;
    };
}
