import * as expressValidator from "express-validator/lib/express_validator";

export class RouteValidator {

    static init(app, options?: any) {
        app.use(expressValidator(options));
    }


    static get(validators): any {

        const validatorFnc: any = (req, res, next) => {

            if (validators.body) {
                req.checkBody(validators.body);
            }

            if (validators.query) {
                req.checkQuery(validators.query);
            }

            if (validators.params) {
                req.checkParams(validators.params);
            }

            req.getValidationResult().then(function (result) {

                if (result.isEmpty()) {
                    next();
                } else {

                    const errors = result.array();
                    res.status(400).json({
                        message: `Validation error - ${errors[0].param} ${errors[0].msg}`,
                        errors: errors
                    })
                }
            });

        };


        return validatorFnc;

    }


}