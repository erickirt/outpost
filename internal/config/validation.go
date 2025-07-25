package config

import (
	"context"
	"fmt"
	"net/url"
)

// Validate checks if the configuration is valid
func (c *Config) Validate(flags Flags) error {
	// Reset validated state
	c.validated = false

	// Validate each component
	if err := c.validateService(flags); err != nil {
		return err
	}

	if err := c.validateRedis(); err != nil {
		return err
	}

	if err := c.validateLogStorage(); err != nil {
		return err
	}

	if err := c.validateMQs(); err != nil {
		return err
	}

	if err := c.validateAESEncryptionSecret(); err != nil {
		return err
	}

	if err := c.validatePortal(); err != nil {
		return err
	}

	if err := c.OpenTelemetry.Validate(); err != nil {
		return err
	}

	// Mark as validated if we get here
	c.validated = true
	return nil
}

// validateService validates the service configuration
func (c *Config) validateService(flags Flags) error {
	// Parse service type from flag & env
	flagService, err := ServiceTypeFromString(flags.Service)
	if err != nil {
		return err
	}

	configService, err := c.GetService()
	if err != nil {
		return err
	}

	// If service is set in config, it must match flag (unless flag is empty)
	if c.Service != "" && flags.Service != "" && configService != flagService {
		return ErrMismatchedServiceType
	}

	// If no service set in config, use flag value
	if c.Service == "" {
		c.Service = flags.Service
	}

	return nil
}

// validateRedis validates the Redis configuration
func (c *Config) validateRedis() error {
	if c.Redis.Host == "" {
		return ErrMissingRedis
	}
	return nil
}

// validateLogStorage validates the ClickHouse / PG configuration
// Temporary: disable CH as it's not fully supported yet
func (c *Config) validateLogStorage() error {
	// if c.ClickHouse.Addr == "" && c.PostgresURL == "" {
	// 	return ErrMissingLogStorage
	// }
	if c.PostgresURL == "" {
		return ErrMissingLogStorage
	}
	// if c.ClickHouse.Addr != "" {
	// 	return fmt.Errorf("ClickHouse is not currently supported")
	// }
	return nil
}

// validateMQs validates the MQs configuration
func (c *Config) validateMQs() error {
	ctx := context.Background()

	// Check delivery queue
	deliveryConfig, err := c.MQs.ToQueueConfig(ctx, "deliverymq")
	if err != nil {
		return fmt.Errorf("failed to validate delivery queue config: %w", err)
	}
	if deliveryConfig == nil {
		return ErrMissingMQs
	}

	// Check log queue
	logConfig, err := c.MQs.ToQueueConfig(ctx, "logmq")
	if err != nil {
		return fmt.Errorf("failed to validate log queue config: %w", err)
	}
	if logConfig == nil {
		return ErrMissingMQs
	}

	return nil
}

// validateAESEncryptionSecret validates the AES encryption secret
func (c *Config) validateAESEncryptionSecret() error {
	if c.AESEncryptionSecret == "" {
		return ErrMissingAESSecret
	}
	return nil
}

// validatePortalProxyURL validates the portal proxy URL if set
func (c *Config) validatePortal() error {
	if c.Portal.ProxyURL != "" {
		if _, err := url.Parse(c.Portal.ProxyURL); err != nil {
			return ErrInvalidPortalProxyURL
		}
	}
	return nil
}
