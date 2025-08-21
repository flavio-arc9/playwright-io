import { test } from ".";

/**
 * Command wrapper that provides method call logging and step tracking for WebDriverIO instances.
 * This class wraps WebDriverIO objects to enable Playwright test step reporting.
 */
export class Command {

    private static readonly ELEMENT_METHODS = [
        { name: 'element', ref: '$' },
        { name: 'elements', ref: '$$' }
    ] as const;

    private static readonly EXCLUDED_PROMISE_METHODS = ['then', 'catch'] as const;

    /**
     * Serializes method arguments into a readable string format for logging.
     * @param args The method arguments to serialize.
     * @returns A string representation of the serialized arguments.
     */
    private serializeMethodArguments(args: unknown[]) {
        if (args.length === 0) {
            return '';
        }

        return args
            .map(arg => this.formatArgument(arg))
            .join(', ');
    }

    /**
     * Formats a single argument for display in logs.
     * @param arg The argument to format.
     * @returns A string representation of the argument.
     */
    private formatArgument(arg: unknown) {
        if (typeof arg === 'function') {
            return `${arg.constructor.name}${arg.name ? ` (${arg.name})` : ' (anonymous)'}`;
        }

        try {
            return JSON.stringify(arg);
        } catch {
            return String(arg);
        }
    }

    /**
     * Wraps a WebDriverIO instance to provide step logging and method tracking.
     * @param instance The WebDriverIO instance to wrap.   
     * @returns A Proxy object that intercepts method calls for logging.
     */
    public wrapInstance<T extends object>(instance: T): T {
        this.validateInstance(instance);

        return new Proxy(instance, {
            get: (target, property, receiver) => {
                const original = Reflect.get(target, property, receiver);

                if (typeof original === 'function') {
                    return (...args: any[]) => {
                        const methodName = property.toString();
                        const originFunction = original.apply(target, args);

                        const formattedArgs = this.serializeMethodArguments(args);
                        const stepTitle = this.createStepTitle(methodName, formattedArgs);

                        test.step(stepTitle, () => { }, { box: true });

                        if (this.isElementMethod(methodName)) {
                            const elementMethod = this.findElementMethod(methodName);
                            return this.wrapElement(originFunction, elementMethod!.name);
                        }
                        return originFunction;
                    };
                }
                return original;
            }
        });
    }

    /**
     * Validates that the instance is a valid object for wrapping.
     * @param instance The instance to validate.
     */
    private validateInstance(instance: unknown) {
        if (typeof instance !== 'object' || instance === null) {
            throw new Error('Instance must be a valid object for wrapping');
        }
    }

    /**
     * Creates a descriptive title for the test step.
     * @param methodName The name of the method being called.
     * @param formattedArgs The formatted arguments for the method call.
     * @returns A string representation of the step title.
     */
    private createStepTitle(methodName: string, formattedArgs: string) {
        return formattedArgs
            ? `driver.${methodName}(${formattedArgs})`
            : `driver.${methodName}()`;
    }

    /**
     * Checks if the method is an element-related method.
     * @param methodName The name of the method to check.
     * @returns True if the method is an element-related method, false otherwise.
     */
    private isElementMethod(methodName: string) {
        return Command.ELEMENT_METHODS.some(method =>
            method.ref.includes(methodName)
        );
    }

    /**
     * Finds the element method configuration by method name.
     * @param methodName The name of the method to find.
     * @returns The element method configuration or undefined if not found.
     */
    private findElementMethod(methodName: string) {
        return Command.ELEMENT_METHODS.find(method =>
            method.ref.includes(methodName)
        );
    }

    /**
     * Wraps element results to provide step logging for element interactions.
     * @param object The object to wrap (element or elements).
     * @param elementMethod The name of the element method being called.
     * @returns A Proxy object that intercepts method calls for logging.
     */
    private wrapElement<T extends object>(object: T, elementMethod: string) {
        if (typeof object !== 'object' || object === null) return object;

        return new Proxy(object, {
            get: (target, property, receiver) => {
                const value = Reflect.get(target, property, receiver);

                if (typeof value === 'function') {
                    return (...args: any[]) => {
                        const methodName = property.toString();
                        if (!this.shouldSkipLogging(methodName)) {

                            const formattedArgs = this.serializeMethodArguments(args);
                            const stepTitle = this.createElementStepTitle(elementMethod, methodName, formattedArgs);
                            test.step(stepTitle, () => { }, { box: true });
                        }
                        return value.apply(target, args);
                    };
                }
                return value;
            }
        });
    }

    /**
     * Determines if logging should be skipped for certain methods (like promise methods).
     * @param propertyName The name of the property to check.
     * @returns True if logging should be skipped, false otherwise.
     */
    private shouldSkipLogging(propertyName: string) {
        return Command.EXCLUDED_PROMISE_METHODS.includes(propertyName as any);
    }

    /**
     * Creates a descriptive title for element interaction steps.
     * @param elementTypeName The type of element (e.g., 'Element', 'Elements').
     * @param propertyName The name of the property being accessed.
     * @param formattedArgs The formatted arguments for the method call.
     * @returns A string representation of the element interaction step title.
     */
    private createElementStepTitle(elementTypeName: string, propertyName: string, formattedArgs: string) {
        return formattedArgs
            ? `${elementTypeName}.${propertyName}(${formattedArgs})`
            : `${elementTypeName}.${propertyName}()`;
    }
}
export const command = new Command();