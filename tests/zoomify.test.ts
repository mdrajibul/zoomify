
import { Zoomify } from '../src/zoomify';

describe('zoomify util', () => {
    const imageSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg';

    const mockImage = {
        naturalWidth: 1200,
        naturalHeight: 2200,
        src: null,
        onload: jest.fn(),
        onerror: jest.fn()
    };

    it('should call run', async () => {
        const cloneMockImage = { ...mockImage };
        (window as any).Image = () => { return cloneMockImage }
        const mockElement = document.createElement('div');
        mockElement.style.backgroundImage = `url(${imageSrc})`;

        await Zoomify.run(mockElement);
        mockImage.onload();

        expect(cloneMockImage.src).not.toBeNull();
        expect(mockElement.onmousemove).not.toBeNull();
    });

    it('should return image src null', async () => {
        const cloneMockImage = { ...mockImage };
        (window as any).Image = () => { return cloneMockImage }
        const mockElement = document.createElement('div');
        mockElement.style.backgroundImage = null;

        new Zoomify(mockElement);

        expect(cloneMockImage.src).toBeNull();
        expect(mockElement.onmousemove).toBeNull();
    });

    describe('when image source given', () => {
        let mockElement: any;
        let initSpy: any;
        let zoomifyRef: any;
        let startSpy: any;
        let stopSpy: any;

        beforeEach(() => {
            (window as any).Image = () => { return mockImage }
            mockElement = document.createElement('div');
            mockElement.style.backgroundImage = `url(${imageSrc})`;

            jest.spyOn(mockElement, 'scrollLeft', 'get').mockImplementation(() => 2);
            jest.spyOn(mockElement, 'scrollTop', 'get').mockImplementation(() => 20);
            jest.spyOn(mockElement, 'offsetLeft', 'get').mockImplementation(() => 50);
            jest.spyOn(mockElement, 'offsetTop', 'get').mockImplementation(() => 20);
            jest.spyOn(mockElement, 'clientWidth', 'get').mockImplementation(() => 500);

            zoomifyRef = new Zoomify(mockElement);

            initSpy = jest.spyOn(zoomifyRef, 'init');
            startSpy = jest.spyOn(zoomifyRef, 'start');
            stopSpy = jest.spyOn(zoomifyRef, 'stop');

        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        it('should render properly', async () => {
            zoomifyRef.init();
            mockImage.onload();

            expect(initSpy).toHaveBeenCalled();
            expect(mockImage.src).toEqual(imageSrc);
        });

        it('should call start', async () => {
            const zoomifyStart = zoomifyRef.start();
            mockImage.onload();
            zoomifyStart.then(() => {
                expect(mockElement.style.cursor).toEqual('crosshair');
                expect(mockElement.onmousemove).not.toBeNull();
            });
            expect(startSpy).toHaveBeenCalled();
        });

        it('should call start after call init function', async () => {
            const initRef = zoomifyRef.init();
            mockImage.onload();
            initRef.then(() => {
                const zoomifyStart = zoomifyRef.start();
                zoomifyStart.then(() => {
                    expect(mockElement.style.cursor).toEqual('crosshair');
                    expect(mockElement.onmousemove).not.toBeNull();
                });
            });
        });

        it('should return backgroundSize when trigger mousemove', async () => {

            const zoomifyStart = zoomifyRef.start();
            mockImage.onload();

            zoomifyStart.then(() => {
                mockElement.onmousemove({
                    pageX: 100,
                    pageY: 300
                });
                expect(mockElement.style.backgroundPosition).toEqual('10.4% 32.72727272727273%');
                expect(mockElement.style.backgroundSize).toEqual('1200px');
            });
        });

        it('should call parentElement scroll when src element scroll zero', async () => {

            jest.spyOn(mockElement, 'scrollLeft', 'get').mockImplementation(() => 0);
            jest.spyOn(mockElement, 'scrollTop', 'get').mockImplementation(() => 0);
            jest.spyOn(mockElement, 'parentElement', 'get').mockImplementation(() => {
                return {
                    scrollLeft: 20,
                    scrollTop: 100
                }
            });

            const zoomifyStart = zoomifyRef.start();
            mockImage.onload();

            zoomifyStart.then(() => {
                mockElement.onmousemove({
                    pageX: 100,
                    pageY: 300
                });
                expect(mockElement.style.backgroundPosition).toEqual('14% 41.45454545454546%');
                expect(mockElement.style.backgroundSize).toEqual('1200px');
            });
        });

        it('should call parentElement when null and src element scroll zero', async () => {

            jest.spyOn(mockElement, 'scrollLeft', 'get').mockImplementation(() => 0);
            jest.spyOn(mockElement, 'scrollTop', 'get').mockImplementation(() => 0);
            jest.spyOn(mockElement, 'parentElement', 'get').mockImplementation(() => null);

            const zoomifyStart = zoomifyRef.start();
            mockImage.onload();

            zoomifyStart.then(() => {
                mockElement.onmousemove({
                    pageX: 100,
                    pageY: 300
                });
                expect(mockElement.style.backgroundPosition).toEqual('10% 30.545454545454547%');
                expect(mockElement.style.backgroundSize).toEqual('1200px');
            });
        });

        it('should return container cursor as default and onmousemove is null when call stop()', async () => {

            zoomifyRef.start();
            zoomifyRef.stop();

            expect(stopSpy).toHaveBeenCalled();
            expect(mockElement.style.cursor).toEqual('default');
            expect(mockElement.style.backgroundPosition).toEqual('top');
            expect(mockElement.style.backgroundSize).toEqual('cover');
            expect(mockElement.onmousemove).toBeNull();
        });
    })
})