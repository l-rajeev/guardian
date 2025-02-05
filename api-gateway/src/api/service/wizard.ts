import { Guardians } from '@helpers/guardians';
import { Logger, RunFunctionAsync, } from '@guardian/common';
import { TaskManager } from '@helpers/task-manager';
import { ServiceError } from '@helpers/service-requests-base';
import { Controller, HttpCode, HttpStatus, Post, Req, Response } from '@nestjs/common';
import { checkPermission } from '@auth/authorization-helper';
import { UserRole } from '@guardian/interfaces';
import { ApiBody, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { InternalServerErrorDTO } from '@middlewares/validation/schemas/errors';

@Controller('wizard')
@ApiTags('wizard')
export class WizardApi {
    @ApiOperation({
        summary: 'Creates a new policy.',
        description: 'Creates a new policy by wizard. Only users with the Standard Registry role are allowed to make the request.',
    })
    @ApiBody({
        schema: {
            'type': 'object',
            'required': [
                'policy',
                'roles',
                'schemas',
                'trustChain'
            ],
            'properties': {
                'roles': {
                    'type': 'array',
                    'items': {
                        'type': 'string'
                    }
                },
                'policy': {
                    'type': 'object',
                    'properties': {
                        'name': {
                            'type': 'string'
                        },
                        'description': {
                            'type': 'string'
                        },
                        'topicDescription': {
                            'type': 'string'
                        },
                        'policyTag': {
                            'type': 'string'
                        }
                    }
                },
                'schemas': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'name': {
                                'type': 'string'
                            },
                            'iri': {
                                'type': 'string'
                            },
                            'isApproveEnable': {
                                'type': 'boolean'
                            },
                            'isMintSchema': {
                                'type': 'boolean'
                            },
                            'mintOptions': {
                                'type': 'object',
                                'properties': {
                                    'tokenId': {
                                        'type': 'string'
                                    },
                                    'rule': {
                                        'type': 'string'
                                    }
                                }
                            },
                            'dependencySchemaIri': {
                                'type': 'string'
                            },
                            'relationshipsSchemaIri': {
                                'type': 'string'
                            },
                            'initialRolesFor': {
                                'type': 'array',
                                'items': {
                                    'type': 'string'
                                }
                            },
                            'rolesConfig': {
                                'type': 'array',
                                'items': {
                                    'type': 'object',
                                    'properties': {
                                        'role': {
                                            'type': 'string'
                                        },
                                        'isApprover': {
                                            'type': 'boolean'
                                        },
                                        'isCreator': {
                                            'type': 'boolean'
                                        },
                                        'gridColumns': {
                                            'type': 'array',
                                            'items': {
                                                'type': 'object',
                                                'properties': {
                                                    'field': {
                                                        'type': 'string'
                                                    },
                                                    'title': {
                                                        'type': 'string'
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                'trustChain': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'role': {
                                'type': 'string'
                            },
                            'mintSchemaIri': {
                                'type': 'string'
                            },
                            'viewOnlyOwnDocuments': {
                                'type': 'boolean'
                            }
                        }
                    }
                }
            }
        }
    })
    @ApiOkResponse({
        description: 'Successful operation.',
        schema: {
            type: 'boolean'
        }
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.',
        schema: {
            $ref: getSchemaPath(InternalServerErrorDTO)
        }
    })
    @Post('/policy')
    @HttpCode(HttpStatus.CREATED)
    async setPolicy(@Req() req, @Response() res): Promise<any> {
        await checkPermission(UserRole.STANDARD_REGISTRY)(req.user);
        try {
            const wizardConfig = req.body;
            const user = req.user;
            const guardians = new Guardians();
            return res.status(201).json(
                await guardians.wizardPolicyCreate(wizardConfig, user.did)
            );
        } catch (error) {
            new Logger().error(error, ['API_GATEWAY']);
            throw error;
        }
    }

    @ApiOperation({
        summary: 'Creates a new policy.',
        description: 'Creates a new policy by wizard. Only users with the Standard Registry role are allowed to make the request.',
    })
    @ApiBody({
        schema: {
            'type': 'object',
            'required': [
                'policy',
                'roles',
                'schemas',
                'trustChain'
            ],
            'properties': {
                'roles': {
                    'type': 'array',
                    'items': {
                        'type': 'string'
                    }
                },
                'policy': {
                    'type': 'object',
                    'properties': {
                        'name': {
                            'type': 'string'
                        },
                        'description': {
                            'type': 'string'
                        },
                        'topicDescription': {
                            'type': 'string'
                        },
                        'policyTag': {
                            'type': 'string'
                        }
                    }
                },
                'schemas': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'name': {
                                'type': 'string'
                            },
                            'iri': {
                                'type': 'string'
                            },
                            'isApproveEnable': {
                                'type': 'boolean'
                            },
                            'isMintSchema': {
                                'type': 'boolean'
                            },
                            'mintOptions': {
                                'type': 'object',
                                'properties': {
                                    'tokenId': {
                                        'type': 'string'
                                    },
                                    'rule': {
                                        'type': 'string'
                                    }
                                }
                            },
                            'dependencySchemaIri': {
                                'type': 'string'
                            },
                            'relationshipsSchemaIri': {
                                'type': 'string'
                            },
                            'initialRolesFor': {
                                'type': 'array',
                                'items': {
                                    'type': 'string'
                                }
                            },
                            'rolesConfig': {
                                'type': 'array',
                                'items': {
                                    'type': 'object',
                                    'properties': {
                                        'role': {
                                            'type': 'string'
                                        },
                                        'isApprover': {
                                            'type': 'boolean'
                                        },
                                        'isCreator': {
                                            'type': 'boolean'
                                        },
                                        'gridColumns': {
                                            'type': 'array',
                                            'items': {
                                                'type': 'object',
                                                'properties': {
                                                    'field': {
                                                        'type': 'string'
                                                    },
                                                    'title': {
                                                        'type': 'string'
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                'trustChain': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'role': {
                                'type': 'string'
                            },
                            'mintSchemaIri': {
                                'type': 'string'
                            },
                            'viewOnlyOwnDocuments': {
                                'type': 'boolean'
                            }
                        }
                    }
                }
            }
        }
    })
    @ApiOkResponse({
        description: 'Successful operation.',
        schema: {
            type: 'boolean'
        }
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.',
        schema: {
            $ref: getSchemaPath(InternalServerErrorDTO)
        }
    })
    @Post('/policy/push')
    @HttpCode(HttpStatus.ACCEPTED)
    async setPolicyAsync(@Req() req, @Response() res): Promise<any> {
        await checkPermission(UserRole.STANDARD_REGISTRY)(req.user);
        const taskManager = new TaskManager();
        const {taskId, expectation} = taskManager.start('Create policy');
        const wizardConfig = req.body;
        const user = req.user;
        RunFunctionAsync<ServiceError>(
            async () => {
                const guardians = new Guardians();
                await guardians.wizardPolicyCreateAsync(
                    wizardConfig,
                    user.did,
                    taskId
                );
            },
            async (error) => {
                new Logger().error(error, ['API_GATEWAY']);
                taskManager.addError(taskId, {
                    code: 500,
                    message: error.message,
                });
            }
        );
        return res.status(202).send({taskId, expectation});
    }

    @ApiOperation({
        summary: 'Get policy config.',
        description: 'Get policy config by wizard. Only users with the Standard Registry role are allowed to make the request.',
    })
    @ApiBody({
        schema: {
            'type': 'object',
            'required': [
                'policy',
                'roles',
                'schemas',
                'trustChain'
            ],
            'properties': {
                'roles': {
                    'type': 'array',
                    'items': {
                        'type': 'string'
                    }
                },
                'policy': {
                    'type': 'object',
                    'properties': {
                        'name': {
                            'type': 'string'
                        },
                        'description': {
                            'type': 'string'
                        },
                        'topicDescription': {
                            'type': 'string'
                        },
                        'policyTag': {
                            'type': 'string'
                        }
                    }
                },
                'schemas': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'name': {
                                'type': 'string'
                            },
                            'iri': {
                                'type': 'string'
                            },
                            'isApproveEnable': {
                                'type': 'boolean'
                            },
                            'isMintSchema': {
                                'type': 'boolean'
                            },
                            'mintOptions': {
                                'type': 'object',
                                'properties': {
                                    'tokenId': {
                                        'type': 'string'
                                    },
                                    'rule': {
                                        'type': 'string'
                                    }
                                }
                            },
                            'dependencySchemaIri': {
                                'type': 'string'
                            },
                            'relationshipsSchemaIri': {
                                'type': 'string'
                            },
                            'initialRolesFor': {
                                'type': 'array',
                                'items': {
                                    'type': 'string'
                                }
                            },
                            'rolesConfig': {
                                'type': 'array',
                                'items': {
                                    'type': 'object',
                                    'properties': {
                                        'role': {
                                            'type': 'string'
                                        },
                                        'isApprover': {
                                            'type': 'boolean'
                                        },
                                        'isCreator': {
                                            'type': 'boolean'
                                        },
                                        'gridColumns': {
                                            'type': 'array',
                                            'items': {
                                                'type': 'object',
                                                'properties': {
                                                    'field': {
                                                        'type': 'string'
                                                    },
                                                    'title': {
                                                        'type': 'string'
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                'trustChain': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'role': {
                                'type': 'string'
                            },
                            'mintSchemaIri': {
                                'type': 'string'
                            },
                            'viewOnlyOwnDocuments': {
                                'type': 'boolean'
                            }
                        }
                    }
                }
            }
        }
    })
    @ApiOkResponse({
        description: 'Successful operation.',
        schema: {
            type: 'boolean'
        }
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.',
        schema: {
            $ref: getSchemaPath(InternalServerErrorDTO)
        }
    })
    @Post('/:policyId/config')
    @HttpCode(HttpStatus.OK)
    async setPolicyConfig(@Req() req, @Response() res): Promise<any> {
        await checkPermission(UserRole.STANDARD_REGISTRY)(req.user);
        try {
            const wizardConfig = req.body;
            const user = req.user;
            const {policyId} = req.params;
            const guardians = new Guardians();
            return res.json(
                await guardians.wizardGetPolicyConfig(
                    policyId,
                    wizardConfig,
                    user.did
                )
            );
        } catch (error) {
            new Logger().error(error, ['API_GATEWAY']);
            throw error;
        }
    }
}
